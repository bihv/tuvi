import type {
  AstrologyContextResult,
  NormalizedAstrolabe,
  NormalizedPalace,
  StarBrightness,
} from '../../types/tuvi'
import {
  ASSISTANT_STARS_KNOWLEDGE,
  MAJOR_STARS_KNOWLEDGE,
  MUTAGENS_KNOWLEDGE,
  PALACES_KNOWLEDGE,
  PATTERNS_KNOWLEDGE,
} from '../data/knowledge'
import {
  getCanChiOfYear,
  getOrCalculateYearlyHoroscope,
  getPalaceByName,
  getSurroundingPalaces,
} from '../../utils/tuvi'

/**
 * Trích xuất đoạn tri thức cho một cung số cụ thể
 */
export function extractPalaceKnowledge(
  astrolabe: NormalizedAstrolabe,
  palace: NormalizedPalace
): string {
  const pKnowledge = PALACES_KNOWLEDGE[palace.name]
  const lines: string[] = []

  lines.push(`### Cung ${palace.name} (Tại Chi: ${palace.earthlyBranch}, Can: ${palace.heavenlyStem})`)
  if (pKnowledge) {
    lines.push(`- **Phương diện**: ${pKnowledge.lifeDomain}`)
    lines.push(`- **Ý nghĩa nền tảng**: ${pKnowledge.coreMeaning}`)
  }
  if (palace.isBodyPalace) {
    lines.push(`- **Đặc điểm**: Thân cư ${palace.name} (Chủ về hành động, trải nghiệm và xu hướng nửa đời sau)`)
  }

  // Tương quan với Vận trình năm xem hạn
  const viewingYear = astrolabe.thienBan?.viewingYear || new Date().getFullYear()
  const canChiYear = getCanChiOfYear(viewingYear)
  const yearlyHoro = getOrCalculateYearlyHoroscope(astrolabe, viewingYear)
  const targetRole = yearlyHoro?.palaceYearlyRoles?.find(r => r.palaceIndex === palace.index)
  if (targetRole) {
    lines.push(`- **Vận trình năm ${viewingYear} (${canChiYear})**: Đóng vai trò là **Lưu ${targetRole.yearlyRole}** trong năm ${viewingYear}.`)
    if (targetRole.yearlyStars && targetRole.yearlyStars.length > 0) {
      lines.push(`- **Sao Lưu Niên tọa thủ**: ${targetRole.yearlyStars.join(', ')}`)
    }
  }

  // Phân tích Chính tinh
  const surrounding = getSurroundingPalaces(astrolabe, palace.name)
  if (palace.majorStars.length === 0) {
    const oppMajors = surrounding?.opposite.majorStars.map(s => s.name).join(', ') || 'Không có chính tinh'
    lines.push(
      `- **Chính tinh**: Không có chính tinh tọa thủ (Cung Vô Chính Diệu). Theo đại pháp "Tá Tinh An Cung" của Trung Châu Phái, mượn toàn bộ chính diệu từ cung xung chiếu (${surrounding?.opposite.name || 'Đối cung'}: ${oppMajors}) về bản cung để luận đoán cát hung.`
    )
  } else {
    lines.push(`- **Chính tinh tọa thủ**:`)
    for (const star of palace.majorStars) {
      const starK = MAJOR_STARS_KNOWLEDGE[star.name]
      const brightnessText = star.brightness ? ` (${star.brightness})` : ''
      const mutagenText = star.mutagen ? ` [Hóa ${star.mutagen}]` : ''

      lines.push(`  * **${star.name}**${brightnessText}${mutagenText}:`)
      if (starK) {
        lines.push(`    - Ngũ hành: ${starK.element} (${starK.yinYang}) | Tính chất: ${starK.role}`)
        if (star.brightness) {
          const meaning = starK.brightnessMeaning[star.brightness as StarBrightness]
          if (meaning) {
            lines.push(`    - Thế đắc hãm (${star.brightness}): ${meaning}`)
          }
        }
        const influence =
          starK.palaceInfluences[palace.name as keyof typeof starK.palaceInfluences] ||
          (palace.name === 'Tử Tức' ? starK.palaceInfluences['Tử Nữ'] : undefined) ||
          (palace.name === 'Nô Bộc' ? starK.palaceInfluences['Giao Hữu'] : undefined) ||
          (palace.name === 'Quan Lộc' ? starK.palaceInfluences['Sự Nghiệp'] : undefined)
        if (influence) {
          lines.push(`    - Luận giải tại ${palace.name}: ${influence}`)
        }
      }
      if (star.mutagen && MUTAGENS_KNOWLEDGE[star.mutagen]) {
        const mInfo = MUTAGENS_KNOWLEDGE[star.mutagen]
        lines.push(`    - Tứ Hóa: ${mInfo.name} - ${mInfo.meaning}`)
      }
    }
  }

  // Phụ tinh và Tứ Hóa nổi bật
  const highlightedMinors: string[] = []
  palace.minorStars.forEach(s => {
    let desc = s.name
    if (s.brightness) desc += ` (${s.brightness})`
    if (s.mutagen) desc += ` [Hóa ${s.mutagen}]`
    const aInfo = ASSISTANT_STARS_KNOWLEDGE[s.name]
    if (aInfo) {
      desc += ` [${aInfo.category}: ${aInfo.coreNature}]`
    }
    highlightedMinors.push(desc)
  })
  if (highlightedMinors.length > 0) {
    lines.push(`- **Phụ tinh đồng cung**: ${highlightedMinors.join(', ')}`)
  }

  // Vòng Tràng Sinh & Vòng Bác Sỹ
  lines.push(`- **Vòng Tràng Sinh & Bác Sỹ**: ${palace.changsheng12} | ${palace.boshi12}`)

  // Tam phương tứ chính
  if (surrounding) {
    const oppMajors = surrounding.opposite.majorStars.map(s => s.name).join(', ') || 'Vô chính diệu'
    const wealthMajors = surrounding.wealth.majorStars.map(s => s.name).join(', ') || 'Vô chính diệu'
    const careerMajors = surrounding.career.majorStars.map(s => s.name).join(', ') || 'Vô chính diệu'

    lines.push(`- **Tam phương tứ chính hội chiếu**:`)
    lines.push(`  * Cung xung chiếu (${surrounding.opposite.name}): ${oppMajors}`)
    lines.push(`  * Cung tam hợp 1 (${surrounding.wealth.name}): ${wealthMajors}`)
    lines.push(`  * Cung tam hợp 2 (${surrounding.career.name}): ${careerMajors}`)
  }

  // Trọng tâm cố vấn và Quy tắc Trung Châu Phái
  if (pKnowledge) {
    lines.push(`- **Trọng tâm định hướng**: ${pKnowledge.counselingFocus}`)
    if (pKnowledge.evaluationRule) {
      lines.push(`- **Quy tắc thẩm định Trung Châu**: ${pKnowledge.evaluationRule}`)
    }
  }

  return lines.join('\n')
}

/**
 * Hàm Structured Domain RAG: Bốc tách tri thức chính xác nạp vào prompt cho LLM
 * - Nếu targetPalaceName có giá trị: Bốc tách chuyên sâu cho Cung được chọn (dùng cho chat hỏi đáp theo cung hoặc Drawer).
 * - Nếu targetPalaceName không có giá trị: Bốc tách toàn diện 4 cung trụ cột và cách cục tổng quan (dùng cho Báo cáo Luận giải 5 mục).
 */
export function retrieveAstrologyContext(
  astrolabe: NormalizedAstrolabe,
  targetPalaceName?: string
): AstrologyContextResult {
  const { thienBan, palaces = [], patterns = [] } = astrolabe || {}
  const markdownSections: string[] = []
  const palaceContexts: Record<string, string> = {}

  if (!thienBan) {
    return {
      knowledgeMarkdown: 'Không có dữ liệu Thiên Bàn.',
      palaceContexts: {},
    }
  }

  // 1. Phần thông tin căn bản đương số (Thiên Bàn)
  markdownSections.push(`## THÔNG TIN ĐƯƠNG SỐ (THIÊN BÀN)`)
  markdownSections.push(`- Họ tên: ${thienBan.name}`)
  markdownSections.push(`- Giới tính: ${thienBan.gender}`)
  markdownSections.push(`- Dương lịch: ${thienBan.solarDate}`)
  markdownSections.push(`- Âm lịch: ${thienBan.lunarDate}`)
  markdownSections.push(`- Can Chi 4 trụ: Năm ${thienBan.chineseDate.year} - Tháng ${thienBan.chineseDate.month} - Ngày ${thienBan.chineseDate.day} - Giờ ${thienBan.chineseDate.hour}`)
  markdownSections.push(`- Canh giờ: ${thienBan.timeName} (${thienBan.timeRange})`)
  markdownSections.push(`- Bản Mệnh & Cục: ${thienBan.fiveElementsClass}`)
  markdownSections.push(`- Chủ Mệnh: ${thienBan.soulStar} | Chủ Thân: ${thienBan.bodyStar}`)
  markdownSections.push(`- Cung Mệnh tại Chi: ${thienBan.soulPalaceBranch} | Cung Thân tại Chi: ${thienBan.bodyPalaceBranch}`)
  const viewingYear = thienBan.viewingYear || new Date().getFullYear()
  const canChiYear = getCanChiOfYear(viewingYear)
  const birthYear = parseInt(thienBan.solarDate?.split('-')[0] || '2000', 10)
  const nominalAge = viewingYear - birthYear + 1 // Tuổi mụ âm lịch

  markdownSections.push(`- Mốc năm xem vận hạn: Năm ${viewingYear} (Năm Âm lịch **${canChiYear}**) - Đương số ${nominalAge} tuổi mụ`)

  // 2. Các đại cách cục đã phát hiện
  if (patterns.length > 0) {
    markdownSections.push(`\n## CÁC ĐẠI CÁCH CỤC PHÁT HIỆN`)
    for (const pat of patterns) {
      const patK = PATTERNS_KNOWLEDGE[pat]
      if (patK) {
        markdownSections.push(`### Cách cục: ${patK.name} (${patK.category})`)
        markdownSections.push(`- **Đặc trưng**: ${patK.characteristics}`)
        markdownSections.push(`- **Xu hướng sự nghiệp**: ${patK.careerTendency}`)
        markdownSections.push(`- **Xu hướng tài chính**: ${patK.wealthTendency}`)
        markdownSections.push(`- **Lời khuyên chiến lược**: ${patK.strategicAdvice}`)
      } else {
        markdownSections.push(`- **Cách cục**: ${pat}`)
      }
    }
  }

  // 3. Xử lý theo targetPalaceName hoặc Tổng quan 4 cung trụ cột
  if (targetPalaceName) {
    const palace = getPalaceByName(astrolabe, targetPalaceName)
    if (palace) {
      markdownSections.push(`\n## TRI THỨC CHUYÊN SÂU CUNG ${palace.name.toUpperCase()}`)
      const pContext = extractPalaceKnowledge(astrolabe, palace)
      markdownSections.push(pContext)
      palaceContexts[palace.name] = pContext
    }
  } else {
    // Tổng quan 4 cung trọng yếu nhất trong luận giải: Mệnh, Quan Lộc, Tài Bạch, Phu Thê
    const corePalaceNames = ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Phu Thê']
    markdownSections.push(`\n## TRI THỨC 4 CUNG NÒNG CỐT`)

    for (const pName of corePalaceNames) {
      const palace = getPalaceByName(astrolabe, pName)
      if (palace) {
        const pContext = extractPalaceKnowledge(astrolabe, palace)
        markdownSections.push(pContext)
        palaceContexts[palace.name] = pContext
      }
    }
  }

  // 4. Chi tiết Vận Hạn: Đại Vận & Lưu Niên Năm ${viewingYear} (${canChiYear})
  // Phần này LUÔN LUÔN được nạp vào context để AI hiểu rõ thời điểm và bối cảnh năm khảo sát
  const yearlyHoro = getOrCalculateYearlyHoroscope(astrolabe, viewingYear)

  const currentDecadalPalace = palaces.find(
    p => p.decadal?.range && nominalAge >= p.decadal.range[0] && nominalAge <= p.decadal.range[1]
  )

  const yearChi = yearlyHoro?.earthlyBranch || canChiYear.split(' ')[1] || ''
  const taiTuePalace = palaces.find(p => p.earthlyBranch === yearChi)

  const luuMenhRole = yearlyHoro?.palaceYearlyRoles.find(r => r.yearlyRole === 'Mệnh')
  const luuQuanRole = yearlyHoro?.palaceYearlyRoles.find(r => r.yearlyRole === 'Quan Lộc')
  const luuTaiRole = yearlyHoro?.palaceYearlyRoles.find(r => r.yearlyRole === 'Tài Bạch')
  const luuPhuRole = yearlyHoro?.palaceYearlyRoles.find(r => r.yearlyRole === 'Phu Thê')
  const luuDiRole = yearlyHoro?.palaceYearlyRoles.find(r => r.yearlyRole === 'Thiên Di')

  function getStarLocation(starName?: string): string {
    if (!starName) return ''
    const found = palaces.find(p =>
      p.majorStars.some(s => s.name === starName) ||
      p.minorStars.some(s => s.name === starName) ||
      p.adjectiveStars.some(s => s.name === starName)
    )
    return found ? `Cung ${found.name} (Chi ${found.earthlyBranch})` : 'Hội chiếu trên lá số'
  }

  const yearlyStarsHighlights: string[] = []
  if (yearlyHoro?.palaceYearlyRoles) {
    for (const role of yearlyHoro.palaceYearlyRoles) {
      if (role.yearlyStars && role.yearlyStars.length > 0) {
        yearlyStarsHighlights.push(`  * Cung ${role.originalPalaceName} (Lưu ${role.yearlyRole}): ${role.yearlyStars.join(', ')}`)
      }
    }
  }

  markdownSections.push(`\n## THỜI ĐIỂM XEM HẠN & VẬN TRÌNH NĂM ${viewingYear} (${canChiYear})`)
  markdownSections.push(`- **Mốc năm xem vận hạn**: Năm ${viewingYear} (Năm Âm lịch **${canChiYear}**).`)
  markdownSections.push(`- **Tuổi mụ của đương số**: ${nominalAge} tuổi.`)
  if (currentDecadalPalace && currentDecadalPalace.decadal?.range) {
    const majorNames = currentDecadalPalace.majorStars?.map(s => s.name).join(', ') || 'Không có chính tinh'
    markdownSections.push(
      `- **Đại vận hiện tại (${currentDecadalPalace.decadal.range[0]} - ${currentDecadalPalace.decadal.range[1]} tuổi)**: Tại Cung ${currentDecadalPalace.name} (Chi ${currentDecadalPalace.decadal.earthlyBranch}, Can ${currentDecadalPalace.decadal.heavenlyStem}). Chính tinh: ${majorNames}.`
    )
  }
  if (taiTuePalace) {
    markdownSections.push(`- **Cung Lưu Thái Tuế năm ${viewingYear}**: Tại Cung ${taiTuePalace.name} (Chi ${yearChi}) - Vị trí trọng tâm tạo biến động hoặc bước ngoặt lớn trong năm.`)
  }
  if (luuMenhRole) {
    markdownSections.push(`- **Cung Lưu Niên Mệnh năm ${viewingYear}**: Tại Cung ${luuMenhRole.originalPalaceName} (Chủ đạo xu hướng tinh thần, năng lượng toàn cục).`)
  }
  if (luuQuanRole) {
    markdownSections.push(`- **Cung Lưu Quan Lộc năm ${viewingYear} (Sự nghiệp & Công việc)**: Tọa tại Cung ${luuQuanRole.originalPalaceName} - Trực tiếp chi phối công danh, dự án, cơ hội thăng tiến và tình hình công việc trong năm cũng như giai đoạn tới cuối năm.`)
  }
  if (luuTaiRole) {
    markdownSections.push(`- **Cung Lưu Tài Bạch năm ${viewingYear} (Tài chính & Thu chi)**: Tọa tại Cung ${luuTaiRole.originalPalaceName} - Chủ về dòng tiền, đầu tư, chi tiêu trong năm.`)
  }
  if (luuPhuRole) {
    markdownSections.push(`- **Cung Lưu Phu Thê năm ${viewingYear} (Tình cảm & Gia đạo)**: Tọa tại Cung ${luuPhuRole.originalPalaceName} - Tình duyên, hôn nhân, sự hòa hợp gia đạo.`)
  }
  if (luuDiRole) {
    markdownSections.push(`- **Cung Lưu Thiên Di năm ${viewingYear} (Xuất hành & Xã giao)**: Tọa tại Cung ${luuDiRole.originalPalaceName} - Mở rộng quan hệ, dịch chuyển, đối ngoại.`)
  }
  if (yearlyHoro?.mutagens) {
    markdownSections.push(`- **Lưu Tứ Hóa năm ${viewingYear} (${canChiYear})**:`)
    markdownSections.push(`  * **Lưu Hóa Lộc**: Sao ${yearlyHoro.mutagens.loc} (${getStarLocation(yearlyHoro.mutagens.loc)}) - Chủ về cơ hội hanh thông, tài lộc khởi sắc, nguồn sinh khí mới.`)
    markdownSections.push(`  * **Lưu Hóa Quyền**: Sao ${yearlyHoro.mutagens.quyen} (${getStarLocation(yearlyHoro.mutagens.quyen)}) - Khẳng định vị thế, nắm quyền kiểm soát, tinh thần trách nhiệm và áp lực hành động.`)
    markdownSections.push(`  * **Lưu Hóa Khoa**: Sao ${yearlyHoro.mutagens.khoa} (${getStarLocation(yearlyHoro.mutagens.khoa)}) - Danh tiếng, học tập nâng cao, quý nhân tương trợ hóa giải khó khăn.`)
    markdownSections.push(`  * **Lưu Hóa Kỵ**: Sao ${yearlyHoro.mutagens.ky} (${getStarLocation(yearlyHoro.mutagens.ky)}) - Điểm nút thắt, thị phi, trở ngại, sai sót thủ tục cần cẩn trọng và hóa giải.`)
  }
  if (yearlyStarsHighlights.length > 0) {
    markdownSections.push(`- **Phân bổ Sao Lưu Niên tại các cung**:`)
    markdownSections.push(yearlyStarsHighlights.join('\n'))
  }

  // 5. Nguyên tắc cố vấn cuộc sống (Apple Minimalist / AI Life Coach Principle & Trung Châu Phái)
  markdownSections.push(`\n## NGUYÊN TẮC LUẬN GIẢI & CỐ VẤN CUỘC SỐNG`)
  markdownSections.push(`1. **Tôn chỉ cố vấn tích cực**: Luôn giữ góc nhìn xây dựng, khai phóng tiềm năng và định hướng hành động thiết thực. Tránh tuyệt đối phán xét định mệnh tiêu cực, hù dọa hoặc mang màu sắc mê tín dị đoan.`)
  markdownSections.push(`2. **Tập trung vào giải pháp (Actionable Advice)**: Mỗi nhận định về ưu/nhược điểm phải đi kèm lời khuyên cụ thể về phát triển bản thân, kỹ năng làm việc, quản lý tài chính và vun đắp các mối quan hệ.`)
  markdownSections.push(`3. **Văn phong Apple Minimalist**: Điềm tĩnh, tinh tế, khúc chiết, chuẩn mực tiếng Việt, từ ngữ giàu tính nhân văn và truyền cảm hứng.`)
  markdownSections.push(`4. **Phương pháp luận Trung Châu Phái**: Tiên khán Phụ Mẫu - Điền Trạch định xuất thân ("Bạch thủ hưng gia" hay "Khắc thiệu cơ cừu"), thứ khán tương quan Mệnh Thân - Phúc Đức để cân bằng thực chất vật chất và an lạc tinh thần, sau đó truy xét cung phát sinh căn nguyên sự việc và các tầng vận hạn.`)

  const knowledgeMarkdown = markdownSections.join('\n')
  const summary = targetPalaceName
    ? `Ngữ cảnh Tử Vi chuyên sâu Cung ${targetPalaceName} và vận hạn năm ${viewingYear} (${canChiYear}) của đương số ${thienBan.name}.`
    : `Ngữ cảnh Tử Vi toàn diện và vận hạn năm ${viewingYear} (${canChiYear}) cho đương số ${thienBan.name} (${thienBan.chineseDate.year}, ${thienBan.fiveElementsClass}).`

  return {
    astrolabeId: astrolabe.id,
    targetPalace: targetPalaceName,
    summary,
    knowledgeMarkdown,
    patterns,
    palaceContexts,
  }
}
