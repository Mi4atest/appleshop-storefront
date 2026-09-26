"use client";

import {
  useCallback,
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
} from "react";

const TAP_SLOP_PX = 8;

type Origin = {
  pointerId: number;
  x: number;
  y: number;
  dragged: boolean;
};

type TapButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel"
> & {
  onActivate: () => void;
};

export function TapButton({
  onActivate,
  type = "button",
  className,
  ...props
}: TapButtonProps) {
  const originRef = useRef<Origin | null>(null);
  const actionRef = useRef(onActivate);
  const skipClickRef = useRef(false);
  actionRef.current = onActivate;

  const onPointerDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    originRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dragged: false,
    };
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const origin = originRef.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    if (
      Math.abs(event.clientX - origin.x) > TAP_SLOP_PX ||
      Math.abs(event.clientY - origin.y) > TAP_SLOP_PX
    ) {
      origin.dragged = true;
    }
  }, []);

  const onPointerUp = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const origin = originRef.current;
    originRef.current = null;
    if (!origin || origin.pointerId !== event.pointerId || origin.dragged) {
      return;
    }
    if (event.pointerType === "mouse") return;
    skipClickRef.current = true;
    actionRef.current();
  }, []);

  const onPointerCancel = useCallback(() => {
    originRef.current = null;
  }, []);

  const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      event.preventDefault();
      return;
    }
    actionRef.current();
  }, []);

  return (
    <button
      {...props}
      type={type}
      className={className ? `touch-auto ${className}` : "touch-auto"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={onClick}
    />
  );
}
