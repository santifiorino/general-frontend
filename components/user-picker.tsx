"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GripVertical, AlertCircleIcon } from "lucide-react";
import { Player } from "@/database/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="text-muted-foreground size-3" />
    </Button>
  );
}

const columns: ColumnDef<Player>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    size: 50,
  },
  {
    id: "select",
    header: () => (
      <div className="flex items-center justify-center w-full">Juega</div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center w-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div
        className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
        onClick={() => row.toggleSelected(!row.getIsSelected())}
      >
        {row.original.name}
      </div>
    ),
  },
];

function DraggableRow({ row }: { row: Row<Player> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={
            cell.column.id === "drag"
              ? "w-12 p-2"
              : cell.column.id === "select"
                ? "w-16 p-0"
                : "p-2"
          }
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
  onStartGame,
}: {
  data: Player[];
  onStartGame: (selectedPlayers: Player[]) => void;
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const selectedPlayers = React.useMemo(() => {
    return table
      .getSelectedRowModel()
      .rows.map((row) =>
        data.find((player) => player.id === row.original.id)
      )
      .filter((player): player is Player => player !== undefined);
  }, [data, rowSelection, table]);

  const handleStartGame = () => {
    if (selectedPlayers.length > 0) {
      onStartGame(selectedPlayers);
    }
  };

  return (
    <div className="space-y-4">
      {selectedPlayers.length >= 2 && selectedPlayers.length <= 4 && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Los resultados no afectarán el ranking.</AlertTitle>
          <AlertDescription>
            Selecciona al menos {5 - selectedPlayers.length} jugador
            {5 - selectedPlayers.length !== 1 ? "es" : ""} más para que la
            partida sea oficial.
          </AlertDescription>
        </Alert>
      )}

      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={
                          header.id === "drag"
                            ? "w-12 p-2"
                            : header.id === "select"
                              ? "w-16 p-0"
                              : "p-2"
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => <DraggableRow key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Cargando...
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {selectedPlayers.length} jugador
          {selectedPlayers.length !== 1 ? "es" : ""} seleccionado
          {selectedPlayers.length !== 1 ? "s" : ""}
        </div>
        <Button onClick={handleStartGame} disabled={selectedPlayers.length < 2}>
          Comenzar Partida
        </Button>
      </div>
    </div>
  );
}
