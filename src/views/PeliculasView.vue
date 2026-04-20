<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Pelicula {
  id: number
  titulo: string
  anio_estreno: number
  duracion: number
  clasificacion_edad: string
  director: string
  calificacion_promedio: string
  estado: string
  plataforma: string
  [key: string]: unknown
}

interface Meta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

const LISTAR_URL = '/bridge/listar/peliculas'

const rows = ref<Pelicula[]>([])
const meta = ref<Meta>({ current_page: 1, last_page: 1, per_page: 15, total: 0, from: 0, to: 0 })
const search = ref('')
const perPage = ref(15)
const working = ref(false)
const errorMsg = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function debounce(fn: () => void, ms = 450) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fn, ms)
}

function buildParams(page: number) {
  const p = new URLSearchParams()
  p.set('page', String(page))
  p.set('per_page', String(perPage.value))
  const s = search.value.trim()
  if (s) p.set('search', s)
  return p.toString()
}

async function load(page = 1) {
  if (working.value) return
  working.value = true
  errorMsg.value = ''
  rows.value = []

  try {
    const url = `${LISTAR_URL}?${buildParams(page)}`
    console.log('[PeliculasView] GET', url)
    const resp = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
    console.log('[PeliculasView] STATUS', resp.status, resp.statusText)

    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)

    const contentType = resp.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const bodyPreview = (await resp.text()).slice(0, 200)
      console.error('[PeliculasView] Non-JSON response preview:', bodyPreview)
      throw new Error('La ruta puente /bridge no esta devolviendo JSON. Revisa el proxy de Apache en produccion.')
    }

    const json = await resp.json()
    const payload = json?.data
    const items: Pelicula[] = payload?.data ?? []
    const m: Partial<Meta> = payload?.meta ?? {}

    meta.value = { ...meta.value, ...m }
    rows.value = items
    console.log('[PeliculasView] OK', {
      page: meta.value.current_page,
      perPage: meta.value.per_page,
      total: meta.value.total,
      rows: items.length,
    })
  } catch (e) {
    console.error('[PeliculasView] ERROR', e)
    errorMsg.value = e instanceof Error ? e.message : 'Error al cargar los datos.'
  } finally {
    working.value = false
  }
}

function applyFilters() { load(1) }
function reload() { load(meta.value.current_page) }
function clearFilters() { search.value = ''; perPage.value = 15; load(1) }
function onSearchInput() { debounce(() => load(1)) }
function onPerPageChange() { load(1) }

const pages = computed(() => {
  const cur = meta.value.current_page
  const last = meta.value.last_page
  const start = Math.max(1, cur - 2)
  const end = Math.min(last, cur + 2)
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
})

function estadoClass(estado: unknown) {
  const e = String(estado ?? '').toLowerCase()
  if (e === 'en cartelera') return 'estado-cartelera'
  if (e === 'próximamente' || e === 'proximamente') return 'estado-proximo'
  if (e === 'streaming') return 'estado-streaming'
  return 'estado-default'
}

onMounted(() => load(1))
</script>

<template>
  <div class="peliculas-page">
    <h1 class="page-title">Películas</h1>

    <!-- Filtros -->
    <div class="filters-bar">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar..."
        class="filter-input"
        @input="onSearchInput"
      />

      <select v-model="perPage" class="filter-select" @change="onPerPageChange">
        <option :value="10">10</option>
        <option :value="15">15</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
      </select>

      <button class="btn btn-primary" @click="applyFilters">Aplicar</button>
      <button class="btn btn-secondary" @click="reload">Recargar</button>
      <button class="btn btn-ghost" @click="clearFilters">Limpiar</button>
    </div>

    <!-- Tabla -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Año</th>
            <th>Duración</th>
            <th>Clasificación</th>
            <th>Director</th>
            <th>Calificación</th>
            <th>Plataforma</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="working">
            <td colspan="9" class="cell-center cell-muted">Cargando…</td>
          </tr>
          <tr v-else-if="errorMsg">
            <td colspan="9" class="cell-center cell-error">{{ errorMsg }}</td>
          </tr>
          <tr v-else-if="!rows.length">
            <td colspan="9" class="cell-center cell-muted">No hay resultados.</td>
          </tr>
          <tr v-for="(row, idx) in rows" :key="row.id ?? idx">
            <td>{{ (meta.from || 1) + idx }}</td>
            <td class="col-titulo">{{ row.titulo }}</td>
            <td>{{ row.anio_estreno }}</td>
            <td>{{ row.duracion }} min</td>
            <td><span class="badge">{{ row.clasificacion_edad }}</span></td>
            <td>{{ row.director }}</td>
            <td class="col-rating">⭐ {{ row.calificacion_promedio }}</td>
            <td>{{ row.plataforma }}</td>
            <td><span class="estado-badge" :class="estadoClass(row.estado)">{{ row.estado }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer: meta + paginador -->
    <div class="table-footer">
      <span class="meta-label">
        Mostrando {{ meta.from }} a {{ meta.to }} de {{ meta.total }} registros
        &middot; Página {{ meta.current_page }} de {{ meta.last_page }}
      </span>

      <nav v-if="meta.last_page > 1" class="pager">
        <button
          class="page-btn"
          :disabled="meta.current_page <= 1"
          @click="load(meta.current_page - 1)"
        >‹</button>

        <button
          v-for="p in pages"
          :key="p"
          class="page-btn"
          :class="{ active: p === meta.current_page }"
          @click="load(p)"
        >{{ p }}</button>

        <button
          class="page-btn"
          :disabled="meta.current_page >= meta.last_page"
          @click="load(meta.current_page + 1)"
        >›</button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.peliculas-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
  color: #333;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a2e;
}

/* Filtros */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-input {
  padding: 0.45rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  width: 14rem;
  outline: none;
  transition: border-color 0.2s;
}
.filter-input:focus { border-color: #4f46e5; }

.filter-select {
  padding: 0.45rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  background: #fff;
  cursor: pointer;
}

.btn {
  padding: 0.45rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn:hover { opacity: 0.85; }
.btn-primary   { background: #4f46e5; color: #fff; }
.btn-secondary { background: #6b7280; color: #fff; }
.btn-ghost     { background: #e5e7eb; color: #374151; }

/* Tabla */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.data-table thead tr {
  background: #f3f4f6;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  font-weight: 600;
  color: #374151;
}

.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #f9fafb; }

.cell-center { text-align: center; padding: 1.5rem; }
.cell-muted  { color: #9ca3af; }
.cell-error  { color: #dc2626; }

.col-titulo { font-weight: 600; color: #1a1a2e; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-rating { white-space: nowrap; }

.badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #e5e7eb;
  color: #374151;
}

.estado-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}
.estado-cartelera { background: #d1fae5; color: #065f46; }
.estado-proximo   { background: #fef3c7; color: #92400e; }
.estado-streaming { background: #dbeafe; color: #1e40af; }
.estado-default   { background: #f3f4f6; color: #6b7280; }

/* Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #6b7280;
}

/* Paginador */
.pager {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.page-btn:hover:not(:disabled):not(.active) { background: #f3f4f6; }
.page-btn.active  { background: #4f46e5; color: #fff; border-color: #4f46e5; }
.page-btn:disabled { opacity: 0.4; cursor: default; }
</style>
