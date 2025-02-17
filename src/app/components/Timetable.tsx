"use client";

import React, { useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  EVENT: "event",
};

interface EventProps {
  id: number;
  text: string;
  position: {
    row: number;
    column: number;
  };
  moveEvent: (id: number, position: { row: number; column: number }) => void;
  editEvent: (id: number) => void;
  deleteEvent: (id: number) => void;
  isDraggable: boolean;
}

const Event = ({
  id,
  text,
  position,
  editEvent,
  deleteEvent,
  isDraggable,
}: EventProps) => {
  const [, ref] = useDrag({
    type: ItemTypes.EVENT,
    item: { id, position },
    canDrag: isDraggable,
  });

  const [showPopup, setShowPopup] = useState(false);

  return (
    <div
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      className="event relative cursor-pointer rounded bg-pink-200 p-2"
      style={{ gridRow: position.row + 1, gridColumn: position.column + 1 }}
      onClick={() => setShowPopup(!showPopup)}
    >
      {text}
      {showPopup && (
        <div className="absolute left-0 top-full z-10 flex flex-col gap-2 rounded border border-gray-300 bg-white p-2">
          <button
            className="rounded bg-pink-400 px-2 py-1 text-white"
            onClick={() => editEvent(id)}
          >
            Edit
          </button>
          <button
            className="rounded bg-pink-400 px-2 py-1 text-white"
            onClick={() => deleteEvent(id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

interface DropZoneProps {
  position: {
    row: number;
    column: number;
  };
  moveEvent: (id: number, position: { row: number; column: number }) => void;
  isOver: boolean;
}

const DropZone = ({ position, moveEvent, isOver }: DropZoneProps) => {
  const [, drop] = useDrop({
    accept: ItemTypes.EVENT,
    drop: (item: { id: number }) => moveEvent(item.id, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={`dropzone ${isOver ? "bg-pink-100" : ""} border border-dashed border-gray-300`}
      style={{ gridRow: position.row + 1, gridColumn: position.column + 1 }}
    />
  );
};

const Timetable: React.FC = () => {
  const [events, setEvents] = useState([
    { id: 1, text: "Game Dev", position: { row: 1, column: 1 } },
    { id: 2, text: "Soft Abs", position: { row: 2, column: 1 } },
  ]);

  const [newEventText, setNewEventText] = useState("");
  const [isDraggable, setIsDraggable] = useState(false);

  const moveEvent = (
    draggedId: number,
    newPosition: { row: number; column: number },
  ) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === draggedId ? { ...event, position: newPosition } : event,
      ),
    );
  };

  const addEvent = () => {
    if (newEventText.trim()) {
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: prevEvents.length + 1,
          text: newEventText,
          position: { row: 1, column: 1 }, // Default position
        },
      ]);
      setNewEventText("");
    }
  };

  const editEvent = (id: number) => {
    const newText = prompt("Edit event name:");
    if (newText) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, text: newText } : event,
        ),
      );
    }
  };

  const deleteEvent = (id: number) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  const gridSize = { rows: 32, columns: 7 }; // 32 half-hour slots from 8 AM to midnight

  const generateTimeLabels = () => {
    const times = [];
    for (let hour = 8; hour <= 23; hour++) {
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
    }
    return times;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="timetable grid grid-cols-8 gap-2 rounded bg-pink-50 p-5">
        <div></div> {/* Empty top-left corner */}
        {[
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ].map((day, index) => (
          <div
            key={index}
            className="rounded bg-pink-300 p-2 text-center font-bold"
          >
            {day}
          </div>
        ))}
        {generateTimeLabels().map((time, index) => (
          <div key={index} className="w-8 text-right text-xs font-light">
            {time}
          </div>
        ))}
        {Array.from({ length: gridSize.rows }).map((_, rowIndex) =>
          Array.from({ length: gridSize.columns }).map((_, colIndex) => (
            <DropZone
              key={`${rowIndex}-${colIndex}`}
              position={{ row: rowIndex + 1, column: colIndex + 1 }}
              moveEvent={moveEvent}
              isOver={false}
            />
          )),
        )}
        {events.map((event) => (
          <Event
            key={event.id}
            id={event.id}
            text={event.text}
            position={event.position}
            moveEvent={moveEvent}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
            isDraggable={isDraggable}
          />
        ))}
      </div>
      <div className="add-event mt-5 flex gap-2">
        <input
          type="text"
          value={newEventText}
          onChange={(e) => setNewEventText(e.target.value)}
          placeholder="New event name"
          className="rounded border p-2"
        />
        <button
          className="rounded bg-pink-400 px-4 py-2 text-white"
          onClick={addEvent}
        >
          Add Event
        </button>
        <button
          className="rounded bg-pink-400 px-4 py-2 text-white"
          onClick={() => setIsDraggable(!isDraggable)}
        >
          {isDraggable ? "Disable Dragging" : "Enable Dragging"}
        </button>
      </div>
    </DndProvider>
  );
};

export default Timetable;
