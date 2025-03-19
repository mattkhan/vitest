import { cleanup, render } from '@testing-library/react'
import { page } from '@vitest/browser/context'
import { afterEach, describe, expect, it, vi } from 'vitest'

const t = (i: number) => `hi ${i}`

function TestComponent() {
  return (
    Array.from({ length: 100 }).map((_, i) => (
      <div key={i} style={{ height: '30px' }}>
        {t(i)}
      </div>
    ))
  )
}

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect()
  return rect.top >= 0 && rect.bottom <= window.innerHeight
}

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }
// await sleep(100)

function itDoesThings(i: number) {
  it(`does ${i}`, async () => {
    render(<TestComponent />)
    const target = page.getByText(t(i), { exact: true }).element()

    await vi.waitFor(() => expect(isInViewport(target)).toBe(false))
    target.scrollIntoView()
    await vi.waitFor(() => expect(isInViewport(target)).toBe(true))
  })
}

describe('scrolling serially', () => {
  afterEach(() => {
    cleanup()
  })

  itDoesThings(50)
  itDoesThings(51)
  itDoesThings(52)
})
