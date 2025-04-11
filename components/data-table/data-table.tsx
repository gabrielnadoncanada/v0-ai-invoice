"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export interface Column<T> {
  header: string
  accessorKey: keyof T | string
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pagination?: boolean
  pageSize?: number
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  searchable = true,
  searchKeys,
  pagination = true,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  // Filtrer les données en fonction de la recherche
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    const query = searchQuery.toLowerCase()
    const keys = searchKeys || (Object.keys(data[0] || {}) as (keyof T)[])

    return data.filter((item) =>
      keys.some((key) => {
        const value = item[key]
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(query)
      }),
    )
  }, [data, searchQuery, searchKeys])

  // Trier les données
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const key = sortConfig.key as keyof T
      const aValue = a[key]
      const bValue = b[key]

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = String(aValue).localeCompare(String(bValue))
      return sortConfig.direction === "asc" ? comparison : -comparison
    })
  }, [filteredData, sortConfig])

  // Paginer les données
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  const totalPages = useMemo(() => {
    return Math.ceil(sortedData.length / pageSize)
  }, [sortedData, pageSize])

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return prevConfig.direction === "asc" ? { key, direction: "desc" } : null
      }
      return { key, direction: "asc" }
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(item)
    }

    const key = column.accessorKey as keyof T
    return item[key]
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey.toString()}
                  className={column.sortable ? "cursor-pointer select-none" : ""}
                  onClick={column.sortable ? () => handleSort(column.accessorKey.toString()) : undefined}
                >
                  {column.header}
                  {sortConfig?.key === column.accessorKey && (
                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun résultat trouvé.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey.toString()}>{getCellValue(item, column)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, sortedData.length)} sur{" "}
            {sortedData.length} résultats
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} sur {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
