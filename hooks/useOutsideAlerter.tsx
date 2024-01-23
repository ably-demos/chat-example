import React, { useCallback, useEffect, useRef } from "react"

/**
 * Hook that alerts clicks outside of the passed ref
 * @example
 *
 *  export default function OutsideAlerter(props) {
 *    const wrapperRef = useRef(null);
 *    useOutsideAlerter(wrapperRef);
 *
 *    return <div ref={wrapperRef}>{props.children}</div>;
 *  }
 */
export function useOutsideAlerter(
  ref: React.MutableRefObject<any>,
  callback: () => void
) {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    },
    [callback, ref]
  )

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside, ref])
}
