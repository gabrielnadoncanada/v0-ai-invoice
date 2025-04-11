"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey: string
    cell?: (item: T) => React.ReactNode
  }[]
  onRowClick?: (item: T) => void
  searchable?: boolean
  pagination?: boolean
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  searchable = true,
  pagination = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrer les données en fonction de la recherche
  const filteredData = searchable
    ? data.filter((item) => {
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(searchQuery.toLowerCase())
        })
      })
    : data

  // Paginer les données
  const paginatedData = pagination
    ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredData

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="w-full pl-8 md:max-w-xs"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Réinitialiser la page lors d'une nouvelle recherche
            }}
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
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
              paginatedData.map((item) => (
                <TableRow
                  key={item.id}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.accessorKey}`}>
                      {column.cell
                        ? column.cell(item)
                        : (item as any)[column.accessorKey] !== undefined
                          ? String((item as any)[column.accessorKey])
                          : ""}
                    </TableCell>
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
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} résultats
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
