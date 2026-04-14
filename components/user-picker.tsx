"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GripVertical, AlertCircleIcon, UserPlus, X } from "lucide-react";
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

function makeColumns(onRemoveGuest: (id: string) => void): ColumnDef<Player>[] {
  return [
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
          className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors flex items-center gap-2"
          onClick={() => row.toggleSelected(!row.getIsSelected())}
        >
          {row.original.name}
          {row.original.isGuest && (
            <span className="text-xs text-muted-foreground italic">
              (invitado)
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) =>
        row.original.isGuest ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveGuest(row.original.id);
            }}
          >
            <X className="size-4" />
          </Button>
        ) : null,
      size: 40,
    },
  ];
}

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
                : cell.column.id === "actions"
                  ? "w-10 p-0"
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
  isCreatingGame,
}: {
  data: Player[];
  onStartGame: (selectedPlayers: Player[]) => void;
  isCreatingGame: boolean;
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [showGuestDialog, setShowGuestDialog] = React.useState(false);
  const [guestName, setGuestName] = React.useState("");
  const guestCounter = React.useRef(0);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleRemoveGuest = React.useCallback((id: string) => {
    setData((prev) => prev.filter((p) => p.id !== id));
    setRowSelection((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const columns = React.useMemo(
    () => makeColumns(handleRemoveGuest),
    [handleRemoveGuest],
  );

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
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
        const oldIndex = data.findIndex((item) => item.id === active.id);
        const newIndex = data.findIndex((item) => item.id === over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const handleAddGuest = () => {
    const trimmed = guestName.trim();
    if (!trimmed) return;
    guestCounter.current += 1;
    const guestId = `guest-${Date.now()}-${guestCounter.current}`;
    const guest: Player = { id: guestId, name: trimmed, isGuest: true };
    setData((prev) => [...prev, guest]);
    setRowSelection((prev) => ({ ...prev, [guestId]: true }));
    setGuestName("");
    setShowGuestDialog(false);
  };

  const selectedPlayers = React.useMemo(() => {
    return data.filter((player) => rowSelection[player.id]);
  }, [data, rowSelection]);

  const selectedDefinedCount = React.useMemo(() => {
    return selectedPlayers.filter((p) => !p.isGuest).length;
  }, [selectedPlayers]);

  const handleStartGame = () => {
    if (selectedPlayers.length > 0) {
      onStartGame(selectedPlayers);
    }
  };

  return (
    <div className="space-y-4">
      {selectedPlayers.length >= 2 && selectedDefinedCount <= 4 && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Los resultados no afectarán el ranking.</AlertTitle>
          <AlertDescription>
            {selectedDefinedCount < 5 && (
              <>
                Selecciona al menos {5 - selectedDefinedCount} jugador
                {5 - selectedDefinedCount !== 1 ? "es" : ""} definido
                {5 - selectedDefinedCount !== 1 ? "s" : ""} más para que la
                partida sea oficial. Los invitados no cuentan para este
                requisito.
              </>
            )}
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
                              : header.id === "actions"
                                ? "w-10 p-0"
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
                items={data.map((d) => d.id)}
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

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowGuestDialog(true)}
      >
        <UserPlus className="size-4 mr-2" />
        Agregar invitado
      </Button>

      <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar invitado</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddGuest();
            }}
            className="flex flex-col gap-4"
          >
            <input
              autoFocus
              type="text"
              placeholder="Nombre del invitado"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setGuestName("");
                  setShowGuestDialog(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!guestName.trim()}
              >
                Agregar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {selectedPlayers.length} jugador
          {selectedPlayers.length !== 1 ? "es" : ""} seleccionado
          {selectedPlayers.length !== 1 ? "s" : ""}
        </div>
        <Button
          onClick={handleStartGame}
          disabled={selectedPlayers.length < 2 || isCreatingGame}
        >
          {isCreatingGame ? "Comenzando..." : "Comenzar Partida"}
        </Button>
      </div>
    </div>
  );
}
