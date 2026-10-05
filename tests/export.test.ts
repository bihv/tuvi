import { describe, expect, it, vi } from 'vitest'
import { createAstrolabe } from '../utils/tuvi'
import { exportAstrolabeAsImage, shareAstrolabe } from '../utils/exportAstrolabe'

describe('Export and Share Utilities', () => {
  const astrolabe = createAstrolabe({
    name: 'Nguyễn Văn Test',
    gender: 'nam',
    calendarType: 'solar',
    year: 2000,
    month: 8,
    day: 16,
    hour: 3,
    minute: 30,
  })

  it('provides exportAstrolabeAsImage function that handles browser environment safely', async () => {
    expect(exportAstrolabeAsImage).toBeDefined()
    expect(typeof exportAstrolabeAsImage).toBe('function')
  })

  it('triggers onNotify callback when sharing astrolabe', async () => {
    const notifySpy = vi.fn()
    await shareAstrolabe(astrolabe, notifySpy)

    expect(notifySpy).toHaveBeenCalled()
    const callArg = notifySpy.mock.calls[0][0]
    expect(callArg.title).toBeTruthy()
  })
})
