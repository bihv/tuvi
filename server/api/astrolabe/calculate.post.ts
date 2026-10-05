import { createError, defineEventHandler, readBody } from 'h3'
import type { AstrolabeCalculateResponse, AstrolabeInput } from '~/types/tuvi'
import { createAstrolabe } from '~/utils/tuvi'

export default defineEventHandler(async (event): Promise<AstrolabeCalculateResponse> => {
  const body = await readBody<AstrolabeInput>(event)

  if (!body || !body.name || !body.gender || !body.year || !body.month || !body.day) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng cung cấp đầy đủ thông tin: họ tên, giới tính, ngày, tháng, năm sinh.',
    })
  }

  try {
    const astrolabe = createAstrolabe({
      name: body.name.trim(),
      gender: body.gender,
      calendarType: body.calendarType || 'solar',
      year: Number(body.year),
      month: Number(body.month),
      day: Number(body.day),
      hour: body.hour !== undefined ? Number(body.hour) : undefined,
      minute: body.minute !== undefined ? Number(body.minute) : undefined,
      timeIndex: body.timeIndex !== undefined ? Number(body.timeIndex) : undefined,
      isLeapMonth: Boolean(body.isLeapMonth),
      viewingYear: body.viewingYear ? Number(body.viewingYear) : new Date().getFullYear(),
    })

    return {
      astrolabe,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 422,
      statusMessage: `Lỗi tính toán an sao Tử Vi: ${error?.message || 'Không thể lập lá số với dữ liệu đã nhập.'}`,
    })
  }
})
