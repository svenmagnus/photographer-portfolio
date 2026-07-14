'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import {
  collectPageIds,
  createMenuItemFromPage,
  findItemLocation,
  menuItemFromApi,
  removeItem,
  serializeMenuItems,
  type ApiMenuItem,
  type ApiPage,
  type BuilderMenuItem,
  type BuilderPage,
} from './types'

const panelStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-250)',
  borderRadius: '4px',
  background: 'var(--theme-elevation-0)',
}

const leftPanelStyle: React.CSSProperties = {
  ...panelStyle,
}

const rightPanelStyle: React.CSSProperties = {
  ...panelStyle,
  minHeight: '420px',
}

const panelHeaderStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  borderBottom: '1px solid var(--theme-elevation-250)',
  fontWeight: 600,
}

const panelBodyStyle: React.CSSProperties = {
  padding: '0.75rem',
}

const buttonStyle: React.CSSProperties = {
  padding: '0.45rem 0.85rem',
  border: '1px solid var(--theme-elevation-400)',
  borderRadius: '4px',
  background: 'var(--theme-elevation-50)',
  cursor: 'pointer',
}

function getPageTypeLabel(pageType: string): string {
  switch (pageType) {
    case 'gallery':
      return 'Galerie'
    case 'blog':
      return 'Blog'
    case 'landing':
      return 'Landingpage'
    default:
      return 'Seite'
  }
}

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  padding: '0.65rem 1.15rem',
  background: 'var(--theme-success-500)',
  borderColor: 'var(--theme-success-500)',
  color: '#fff',
  fontWeight: 600,
}

function dedupeLoadedMenuItems(items: BuilderMenuItem[]): BuilderMenuItem[] {
  const seenPageIds = new Set<string>()
  const result: BuilderMenuItem[] = []

  for (const item of items) {
    const pageId = item.page?.id != null ? String(item.page.id) : null

    if (pageId) {
      if (seenPageIds.has(pageId)) continue
      seenPageIds.add(pageId)
    }

    result.push({
      ...item,
      children: dedupeLoadedMenuItems(item.children),
    })
  }

  return result
}

function cloneItems(items: BuilderMenuItem[]): BuilderMenuItem[] {
  return items.map((item) => ({
    ...item,
    children: cloneItems(item.children),
  }))
}

function indentItem(items: BuilderMenuItem[], clientId: string): BuilderMenuItem[] {
  const next = cloneItems(items)
  const location = findItemLocation(next, clientId)
  if (!location || location.index === 0) return items

  const [moved] = location.items.splice(location.index, 1)
  if (!moved) return items

  const previous = location.items[location.index - 1]
  previous.children = [...previous.children, moved]

  return next
}

function outdentItem(items: BuilderMenuItem[], clientId: string): BuilderMenuItem[] {
  const next = cloneItems(items)

  function walk(list: BuilderMenuItem[], container: BuilderMenuItem[] | null, parentIndex: number | null): boolean {
    for (let index = 0; index < list.length; index += 1) {
      const item = list[index]
      if (item.clientId === clientId && container && parentIndex != null) {
        const [moved] = list.splice(index, 1)
        container.splice(parentIndex + 1, 0, moved)
        return true
      }

      if (walk(item.children, list, index)) return true
    }

    return false
  }

  walk(next, null, null)
  return next
}

function MenuTreeItem({
  item,
  depth,
  onRemove,
  onIndent,
  onOutdent,
  onDragStart,
  onDragOver,
  onDrop,
  dragOverId,
}: {
  item: BuilderMenuItem
  depth: number
  onRemove: (clientId: string) => void
  onIndent: (clientId: string) => void
  onOutdent: (clientId: string) => void
  onDragStart: (clientId: string) => void
  onDragOver: (clientId: string) => void
  onDrop: (targetId: string) => void
  dragOverId: string | null
}) {
  const subtitle =
    item.linkType === 'page'
      ? item.page?.slug
        ? `Seite · /${item.page.slug}`
        : 'Seite'
      : item.linkType === 'category'
        ? `Kategorie · ${item.category ?? '—'}`
        : `Link · ${item.url ?? '—'}`

  return (
    <>
      <li
        draggable
        onDragStart={() => onDragStart(item.clientId)}
        onDragOver={(event) => {
          event.preventDefault()
          onDragOver(item.clientId)
        }}
        onDrop={(event) => {
          event.preventDefault()
          onDrop(item.clientId)
        }}
        style={{
          listStyle: 'none',
          marginBottom: '0.5rem',
          marginLeft: `${depth * 1.25}rem`,
          padding: '0.65rem 0.75rem',
          border:
            dragOverId === item.clientId
              ? '1px solid var(--theme-success-500)'
              : '1px solid var(--theme-elevation-250)',
          borderRadius: '4px',
          background: 'var(--theme-elevation-50)',
          cursor: 'grab',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <strong>{item.label}</strong>
            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>{subtitle}</div>
            {depth > 0 && <div style={{ fontSize: '0.8rem', opacity: 0.65 }}>Unterpunkt</div>}
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button type="button" style={buttonStyle} onClick={() => onIndent(item.clientId)} title="Als Unterpunkt">
              →
            </button>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => onOutdent(item.clientId)}
              disabled={depth === 0}
              title="Eine Ebene nach oben"
            >
              ←
            </button>
            <button type="button" style={buttonStyle} onClick={() => onRemove(item.clientId)} title="Entfernen">
              ✕
            </button>
          </div>
        </div>
      </li>
      {item.children.map((child) => (
        <MenuTreeItem
          key={child.clientId}
          item={child}
          depth={depth + 1}
          onRemove={onRemove}
          onIndent={onIndent}
          onOutdent={onOutdent}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          dragOverId={dragOverId}
        />
      ))}
    </>
  )
}

export function MenuBuilder() {
  const [pages, setPages] = useState<BuilderPage[]>([])
  const [menuItems, setMenuItems] = useState<BuilderMenuItem[]>([])
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set())
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const usedPageIds = useMemo(() => collectPageIds(menuItems), [menuItems])

  const availablePages = useMemo(() => {
    const query = search.trim().toLowerCase()

    return pages
      .filter((page) => !usedPageIds.has(String(page.id)))
      .filter((page) => {
        if (!query) return true
        return page.title.toLowerCase().includes(query) || page.slug.toLowerCase().includes(query)
      })
  }, [pages, usedPageIds, search])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [pagesResponse, menuResponse] = await Promise.all([
        fetch('/api/pages?limit=200&depth=0&where[status][equals]=published&sort=title'),
        fetch('/api/globals/main-menu?depth=2'),
      ])

      if (!pagesResponse.ok) {
        throw new Error('Seiten konnten nicht geladen werden.')
      }

      const pagesData = (await pagesResponse.json()) as { docs?: ApiPage[] }
      setPages(
        (pagesData.docs ?? []).map((page) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          pageType: page.pageType,
          galleryCategory: page.galleryCategory ?? null,
        })),
      )

      if (menuResponse.ok) {
        const menuData = (await menuResponse.json()) as { items?: ApiMenuItem[] | null }
        const loaded = (menuData.items ?? []).map(menuItemFromApi)
        setMenuItems(dedupeLoadedMenuItems(loaded))
      } else {
        setMenuItems([])
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Laden fehlgeschlagen.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  function togglePageSelection(pageId: string | number) {
    const key = String(pageId)
    setSelectedPageIds((current) => {
      const next = new Set(current)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  function addSelectedPages() {
    const selectedPages = pages.filter((page) => selectedPageIds.has(String(page.id)))
    if (selectedPages.length === 0) return

    setMenuItems((current) => [...current, ...selectedPages.map(createMenuItemFromPage)])
    setSelectedPageIds(new Set())
    setMessage(`${selectedPages.length} Seite(n) zum Menü hinzugefügt.`)
  }

  function handleRemove(clientId: string) {
    setMenuItems((current) => removeItem(current, clientId))
  }

  function handleIndent(clientId: string) {
    setMenuItems((current) => indentItem(current, clientId))
  }

  function handleOutdent(clientId: string) {
    setMenuItems((current) => outdentItem(current, clientId))
  }

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null)
      setDragOverId(null)
      return
    }

    setMenuItems((current) => {
      const next = cloneItems(current)
      const source = findItemLocation(next, draggingId)
      const target = findItemLocation(next, targetId)
      if (!source || !target) return current

      const [moved] = source.items.splice(source.index, 1)
      if (!moved) return current

      const adjustedTarget = findItemLocation(next, targetId)
      if (!adjustedTarget) return current

      adjustedTarget.items.splice(adjustedTarget.index, 0, moved)
      return next
    })

    setDraggingId(null)
    setDragOverId(null)
  }

  async function handleSave() {
    setIsSaving(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/api/globals/main-menu?depth=0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: serializeMenuItems(menuItems),
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message || 'Menü konnte nicht gespeichert werden.')
      }

      setMessage('Menü gespeichert.')
      await loadData()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Speichern fehlgeschlagen.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <p>Menü wird geladen …</p>
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <section style={leftPanelStyle}>
            <div style={panelHeaderStyle}>Seiten hinzufügen</div>
            <div style={panelBodyStyle}>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Seiten suchen …"
                style={{
                  width: '100%',
                  marginBottom: '0.75rem',
                  padding: '0.55rem 0.65rem',
                  border: '1px solid var(--theme-elevation-250)',
                  borderRadius: '4px',
                }}
              />

              <div style={{ maxHeight: '420px', overflowY: 'auto', marginBottom: '0.75rem' }}>
                {availablePages.length === 0 ? (
                  <p style={{ opacity: 0.7, margin: 0 }}>Keine weiteren Seiten verfügbar.</p>
                ) : (
                  availablePages.map((page) => (
                    <label
                      key={String(page.id)}
                      style={{
                        display: 'flex',
                        gap: '0.65rem',
                        alignItems: 'flex-start',
                        padding: '0.45rem 0',
                        borderBottom: '1px solid var(--theme-elevation-100)',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPageIds.has(String(page.id))}
                        onChange={() => togglePageSelection(page.id)}
                      />
                      <span>
                        <strong>{page.title}</strong>
                        <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                          {getPageTypeLabel(page.pageType)} · /{page.slug}
                        </div>
                      </span>
                    </label>
                  ))
                )}
              </div>

              <button type="button" style={buttonStyle} onClick={addSelectedPages} disabled={selectedPageIds.size === 0}>
                Zum Menü hinzufügen
              </button>
            </div>
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
            <button type="button" style={primaryButtonStyle} onClick={() => void handleSave()} disabled={isSaving}>
              {isSaving ? 'Speichern …' : 'Menü speichern'}
            </button>
            {message && <span style={{ color: 'var(--theme-success-500)' }}>{message}</span>}
            {error && <span style={{ color: 'var(--theme-error-500)' }}>{error}</span>}
          </div>
        </div>

        <section style={rightPanelStyle}>
          <div style={panelHeaderStyle}>Menü-Struktur</div>
          <div style={panelBodyStyle}>
            {menuItems.length === 0 ? (
              <p style={{ opacity: 0.7, marginTop: 0 }}>Noch keine Menüpunkte — links Seiten auswählen.</p>
            ) : (
              <ul style={{ margin: 0, padding: 0 }}>
                {menuItems.map((item) => (
                  <MenuTreeItem
                    key={item.clientId}
                    item={item}
                    depth={0}
                    onRemove={handleRemove}
                    onIndent={handleIndent}
                    onOutdent={handleOutdent}
                    onDragStart={setDraggingId}
                    onDragOver={setDragOverId}
                    onDrop={handleDrop}
                    dragOverId={dragOverId}
                  />
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
