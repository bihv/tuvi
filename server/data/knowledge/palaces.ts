/**
 * Tri thức về Thập Nhị Cung theo Trung Châu Phái
 * Dựa trên tài liệu: "Trung Châu Phái Tử Vi Đẩu Số Sơ Cấp Giảng Nghĩa" - Vương Đình Chi
 */

export interface PalaceKnowledge {
  name: string
  alias?: string
  lifeDomain: string
  coreMeaning: string
  counselingFocus: string
  keyQuestions: string[]
  oppositePalaceName: string
  trinePalaceNames: [string, string]
  adjacentPalaceNames?: [string, string]
  evaluationRule?: string
}

export const PALACES_KNOWLEDGE: Record<string, PalaceKnowledge> = {
  'Mệnh': {
    name: 'Mệnh',
    alias: 'Bản Mệnh / Mệnh Thân',
    lifeDomain: 'Bản thể cốt lõi, tư chất bẩm sinh, thế mạnh tự nhiên và bức tranh tổng thể đời người',
    coreMeaning:
      'Cung vị quan trọng nhất trên lá số, quyết định tính cách gốc rễ, tư chất bẩm sinh, tài năng và cách thức đương số phản ứng trước mọi biến cố cuộc đời. Trong Trung Châu Phái, Mệnh và Thân phối hợp chặt chẽ: Mệnh chủ tiền vận và tính cách tiềm tàng, Thân chủ hậu vận và hành vi xuất phát từ sự trải nghiệm.',
    counselingFocus:
      'Tập trung khai phá tiềm năng độc bản, nhận diện điểm mù tâm lý để tự hoàn thiện và định vị con đường phát triển phù hợp nhất với bản thể tự nhiên.',
    keyQuestions: [
      'Tính cách cốt lõi và thế mạnh tự nhiên của tôi là gì?',
      'Định hướng phát triển dài hạn nào phù hợp nhất với bản thể của tôi?',
      'Làm thế nào để vượt qua những giới hạn nội tại và điểm mù tâm lý của bản thân?',
    ],
    oppositePalaceName: 'Thiên Di',
    trinePalaceNames: ['Quan Lộc', 'Tài Bạch'],
    adjacentPalaceNames: ['Huynh Đệ', 'Phụ Mẫu'],
    evaluationRule:
      'Quy tắc Trung Châu Phái: Tiên khán Phụ Mẫu - Điền Trạch xem xuất thân để định "Bạch thủ hưng gia" hay "Khắc thiệu cơ cừu", sau đó đối chiếu Mệnh Thân với Phúc Đức để cân bằng giữa thành tựu vật chất và sự an lạc tinh thần.',
  },

  'Phụ Mẫu': {
    name: 'Phụ Mẫu',
    alias: 'Cha Mẹ & Bậc Trưởng Bối',
    lifeDomain: 'Nền tảng gia đình, phúc trạch trưởng bối và sự che chở thuở ấu thơ',
    coreMeaning:
      'Đại diện cho mối quan hệ với cha mẹ, sự giáo dưỡng thời thơ ấu, phúc đức gia phong và sự hỗ trợ từ cấp trên, lãnh đạo, quý nhân đi trước. Trong Trung Châu Phái, cung Phụ Mẫu còn là cung xung đối của Tật Ách, phản ánh yếu tố di truyền và gen thể chất từ dòng họ.',
    counselingFocus:
      'Thấu hiểu và hàn gắn các kết nối gia đình, học hỏi trí tuệ từ những người đi trước và tận dụng sự bảo bọc đúng cách mà không bị lệ thuộc.',
    keyQuestions: [
      'Mối quan hệ giữa tôi và cha mẹ mang lại điểm tựa hay bài học chuyển hóa gì?',
      'Tôi có nhận được sự nâng đỡ thuận lợi từ cấp trên và quý nhân đi trước không?',
      'Làm thế nào để hóa giải xung khắc thế hệ và kế thừa những giá trị tốt đẹp từ gia đình?',
    ],
    oppositePalaceName: 'Tật Ách',
    trinePalaceNames: ['Nô Bộc', 'Tử Tức'],
    adjacentPalaceNames: ['Mệnh', 'Phúc Đức'],
    evaluationRule:
      'Kết hợp cùng Điền Trạch để xác định điểm xuất phát kinh tế thuở đầu đời; phân định rõ sự tương hợp hay hình khắc để có ứng xử hiếu kính phù hợp.',
  },

  'Phúc Đức': {
    name: 'Phúc Đức',
    alias: 'Đời Sống Tinh Thần & Phúc Ấm Tổ Tiên',
    lifeDomain: 'Đời sống nội tâm, tư tưởng hưởng thụ, sự an lạc và tuổi thọ tinh thần',
    coreMeaning:
      'Phản ánh chiều sâu tâm linh, đời sống nội tâm, sự bình yên trong tâm thức, phúc phần của dòng tộc và tuổi thọ tinh thần. Cung Phúc Đức đối xung trực tiếp với Tài Bạch, thể hiện sự giằng co tự nhiên giữa ham muốn tích lũy vật chất và nhu cầu thanh thản trong tâm hồn.',
    counselingFocus:
      'Nuôi dưỡng lòng biết ơn, thực hành tĩnh tâm, gìn giữ năng lượng an lành và bồi đắp phúc thiện để chuyển hóa tai ương.',
    keyQuestions: [
      'Đời sống tinh thần của tôi có thực sự an lạc và hạnh phúc từ bên trong không?',
      'Cách bồi đắp phúc khí và nâng cao năng lượng tinh thần mỗi ngày?',
      'Làm sao để cân bằng giữa áp lực kiếm tiền (Tài Bạch) và sự thảnh thơi tâm trí (Phúc Đức)?',
    ],
    oppositePalaceName: 'Tài Bạch',
    trinePalaceNames: ['Phu Thê', 'Thiên Di'],
    adjacentPalaceNames: ['Phụ Mẫu', 'Điền Trạch'],
    evaluationRule:
      'So sánh tương quan Mệnh - Phúc Đức: Nếu Mệnh tốt Phúc xấu, dễ giàu sang nhưng tinh thần bất an, hôn nhân trắc trở; nếu Phúc tốt Mệnh bình hòa thì tâm hồn tự tại, sống thanh thản trường thọ.',
  },

  'Điền Trạch': {
    name: 'Điền Trạch',
    alias: 'Gia Trạch & Bất Động Sản',
    lifeDomain: 'Cơ nghiệp nhà cửa, đất đai, tích lũy tài sản cố định và không khí gia đình',
    coreMeaning:
      'Đại diện cho khả năng tích lũy sản nghiệp lâu dài, sự hưng suy của tổ nghiệp, môi trường sống và không khí ấm êm trong gia đạo. Trong Trung Châu Phái, Điền Trạch là kho chứa tài sản thực tế, phản ánh năng lực biến dòng tiền lưu động thành tài sản trường tồn.',
    counselingFocus:
      'Quy hoạch không gian sống bình an, chiến lược tích lũy và đầu tư bất động sản an toàn, tạo dựng nền tảng vững chắc cho thế hệ sau.',
    keyQuestions: [
      'Tiềm năng sở hữu và tích lũy bất động sản của tôi như thế nào?',
      'Không khí gia đạo và môi trường nơi ở tác động thế nào đến vận khí của tôi?',
      'Chiến lược gia tăng tài sản cố định nào phù hợp nhất với tôi?',
    ],
    oppositePalaceName: 'Tử Tức',
    trinePalaceNames: ['Tật Ách', 'Huynh Đệ'],
    adjacentPalaceNames: ['Phúc Đức', 'Quan Lộc'],
    evaluationRule:
      'Điền Trạch cùng Phụ Mẫu định hình xuất thân; nếu đắc cách "Tài Ấm Giáp Ấn" là trùm sỏ địa sản hưng vượng, nếu gặp "Hình Kỵ Giáp Ấn" phải hết sức phòng ngừa kiện tụng tranh chấp đất đai.',
  },

  'Quan Lộc': {
    name: 'Quan Lộc',
    alias: 'Sự Nghiệp & Danh Vị',
    lifeDomain: 'Sự nghiệp, vị thế xã hội, khuynh hướng nghề nghiệp và con đường tiến thân',
    coreMeaning:
      'Thể hiện con đường công danh, vị thế trong xã hội, mức độ thăng tiến và phong cách làm việc của đương số. Tam hợp cùng Mệnh và Tài Bạch tạo nên Tam Giác Thành Công vật chất. Cung này phản ánh đương số thích hợp với vai trò lãnh đạo, chuyên môn kỹ thuật, kinh doanh tự do hay công chức nhà nước.',
    counselingFocus:
      'Định vị lộ trình sự nghiệp chiến lược, mài sắc thế mạnh cạnh tranh cốt lõi và xây dựng uy tín thương hiệu cá nhân bền vững.',
    keyQuestions: [
      'Môi trường làm việc và lĩnh vực nào giúp tôi phát huy tối đa năng lực?',
      'Làm thế nào để bứt phá lên các nấc thang lãnh đạo hoặc mở rộng quy mô kinh doanh?',
      'Cách vượt qua những giai đoạn chững lại hoặc trắc trở trong con đường công danh?',
    ],
    oppositePalaceName: 'Phu Thê',
    trinePalaceNames: ['Mệnh', 'Tài Bạch'],
    adjacentPalaceNames: ['Điền Trạch', 'Nô Bộc'],
    evaluationRule:
      'Đối xung Phu Thê cho thấy sự nghiệp và hôn nhân luôn tương tác hỗ trợ hoặc cản trở nhau; cần căn cứ vào ngũ hành và tính chất chính diệu để chọn ngành nghề văn chức, võ chức hay công nghệ sáng tạo.',
  },

  'Nô Bộc': {
    name: 'Nô Bộc',
    alias: 'Giao Hữu & Mạng Lưới Quan Hệ',
    lifeDomain: 'Bạn bè, đồng nghiệp, cộng sự, cấp dưới và nghệ thuật dùng người',
    coreMeaning:
      'Thời xưa gọi là Nô Phó, thời hiện đại chuyển hóa thành Giao Hữu (bạn bè, cấp dưới, mạng lưới quan hệ xã hội, đối tác và khách hàng). Phản ánh khả năng quy tụ nhân tâm, mức độ trung thành của thuộc cấp và nguy cơ bị phản trắc hay được đồng sự phò tá đắc lực.',
    counselingFocus:
      'Xây dựng mạng lưới quan hệ chất lượng, nâng cao năng lực lãnh đạo và thuật dùng người, phòng ngừa rủi ro bị liên lụy hoặc phản trắc.',
    keyQuestions: [
      'Mạng lưới bạn bè và cộng sự hiện tại đang nâng đỡ hay cản trở tôi?',
      'Làm thế nào để thu hút và giữ chân nhân tài, thuộc cấp đắc lực?',
      'Cách nhận diện và phòng ngừa những mối quan hệ độc hại, lợi dụng?',
    ],
    oppositePalaceName: 'Huynh Đệ',
    trinePalaceNames: ['Phụ Mẫu', 'Tử Tức'],
    adjacentPalaceNames: ['Quan Lộc', 'Thiên Di'],
    evaluationRule:
      'Đối xung Huynh Đệ; nếu Mệnh mạnh Nô yếu thì dễ bề quản lý và dẫn dắt, nếu Mệnh yếu mà Nô Bộc quá vượng sát tinh thì cấp dưới dễ lấn lướt, bạn bè dễ kéo lùi.',
  },

  'Thiên Di': {
    name: 'Thiên Di',
    alias: 'Xuất Ngoại & Môi Trường Bên Ngoài',
    lifeDomain: 'Môi trường xã hội bên ngoài, khả năng xuất ngoại, thích ứng và giao tế',
    coreMeaning:
      'Là tấm gương phản chiếu trực diện của Cung Mệnh. Phản ánh vận thế khi bước chân ra ngoài xã hội, cơ hội xuất ngoại định cư hoặc đi công tác xa, khả năng thích ứng với bối cảnh mới và sức hút đối với giới bên ngoài. Trong Trung Châu Phái, đây là cung cực kỳ trọng yếu khi Mệnh Vô Chính Diệu.',
    counselingFocus:
      'Mở rộng không gian hoạt động, chủ động nắm bắt cơ hội ở phương xa hoặc thị trường quốc tế, rèn luyện kỹ năng thích ứng linh hoạt.',
    keyQuestions: [
      'Tôi phát triển tốt hơn ở quê hương bản quán hay nên đi xa, xuất ngoại?',
      'Hình ảnh và uy tín của tôi trong mắt xã hội bên ngoài như thế nào?',
      'Cách xây dựng mối quan hệ ngoại giao hiệu quả và an toàn khi bước ra môi trường mới?',
    ],
    oppositePalaceName: 'Mệnh',
    trinePalaceNames: ['Phúc Đức', 'Phu Thê'],
    adjacentPalaceNames: ['Nô Bộc', 'Tật Ách'],
    evaluationRule:
      'Khi Mệnh Vô Chính Diệu, toàn bộ tinh diệu từ Thiên Di được tá mượn về theo phép Tá Tinh An Cung để định hình tính cách và vận thế của đương số.',
  },

  'Tật Ách': {
    name: 'Tật Ách',
    alias: 'Sức Khỏe & Tạng Phủ Ngũ Hành',
    lifeDomain: 'Sức khỏe thể chất, nguy cơ bệnh tật ngũ hành và khả năng tự chữa lành',
    coreMeaning:
      'Đại diện cho thể trạng nguyên khí bẩm sinh, sự cân bằng âm dương ngũ hành của các cơ quan tạng phủ trong cơ thể. Cung Tật Ách giúp nhận diện sớm các điểm yếu sinh học, nguy cơ bệnh lý tiềm tàng hoặc tai nạn thể chất để chủ động phòng ngừa và dưỡng sinh.',
    counselingFocus:
      'Lắng nghe cơ thể, điều chỉnh lối sống và chế độ dinh dưỡng thuận theo ngũ hành, chủ động tầm soát sức khỏe để hóa giải mầm mống bệnh tật.',
    keyQuestions: [
      'Cơ quan tạng phủ nào trong cơ thể tôi có xu hướng nhạy cảm hoặc dễ tổn thương?',
      'Lối sống và thói quen sinh hoạt hiện tại đang tác động thế nào đến sức khỏe dài hạn?',
      'Phương pháp dưỡng sinh và tái tạo năng lượng thể chất nào phù hợp nhất với tôi?',
    ],
    oppositePalaceName: 'Phụ Mẫu',
    trinePalaceNames: ['Điền Trạch', 'Huynh Đệ'],
    adjacentPalaceNames: ['Thiên Di', 'Tài Bạch'],
    evaluationRule:
      'Đối xung Phụ Mẫu (yếu tố di truyền); căn cứ vào ngũ hành âm dương của các chính tinh và sát tinh tọa thủ (như Vũ Khúc phế quản, Tử Vi tỳ vị, Thái Dương mắt/tim) để chẩn đoán chính xác.',
  },

  'Tài Bạch': {
    name: 'Tài Bạch',
    alias: 'Tài Lộc & Dòng Tiền',
    lifeDomain: 'Nguồn thu nhập, năng lực quản lý tài chính và phương thức kiếm tiền',
    coreMeaning:
      'Phản ánh cách thức đương số kiếm tiền (từ chuyên môn, kinh doanh buôn bán, đầu tư mạo hiểm hay tích lũy ổn định), quy mô dòng tiền và thói quen giữ tiền. Cung này đối xung trực diện với Phúc Đức, thể hiện mối tương quan giữa sự nỗ lực kiếm tiền và mức độ hưởng thụ tinh thần.',
    counselingFocus:
      'Xây dựng chiến lược tài chính cá nhân thông minh, đa dạng hóa nguồn thu nhập dựa trên thế mạnh thực chất và kiểm soát rủi ro dòng tiền.',
    keyQuestions: [
      'Con đường tạo ra thu nhập thuận lợi và bền vững nhất cho tôi là gì?',
      'Tôi nên ưu tiên tích lũy an toàn hay đầu tư mạo hiểm để nhân tài sản?',
      'Cách khắc phục những thói quen chi tiêu bốc đồng hoặc điểm yếu trong giữ tiền?',
    ],
    oppositePalaceName: 'Phúc Đức',
    trinePalaceNames: ['Mệnh', 'Quan Lộc'],
    adjacentPalaceNames: ['Tật Ách', 'Tử Tức'],
    evaluationRule:
      'Trung Châu Phái phân biệt rõ sao Tích Tài (Thiên Phủ, Vũ Khúc, Thái Âm) với sao Lưu Động Tài (Thiên Cơ, Thái Dương, Lộc Mã); sao Tích Tài ưa tĩnh tích lũy, sao Lưu Động Tài ưa động xoay vòng.',
  },

  'Tử Tức': {
    name: 'Tử Tức',
    alias: 'Tử Nữ & Hậu Duệ Kế Cận',
    lifeDomain: 'Con cái, học trò, nhân viên kế cận và phúc phận thế hệ sau',
    coreMeaning:
      'Đại diện cho nhân duyên với con cái, số lượng và tính cách của con cái, mức độ hòa hợp giữa các thế hệ. Trong xã hội hiện đại, cung Tử Tức còn mở rộng sang các học trò, đệ tử, nhân sự trẻ được đương số trực tiếp bảo trợ, dìu dắt và truyền thụ kinh nghiệm.',
    counselingFocus:
      'Thấu cảm tâm lý thế hệ trẻ, phương pháp giáo dục tôn trọng sự khác biệt, đồng hành và chuẩn bị hành trang tốt nhất cho con cái bước vào đời.',
    keyQuestions: [
      'Mối liên kết giữa tôi và con cái có những đặc điểm và bài học gì?',
      'Phương pháp giáo dục và định hướng nào giúp con cái phát huy tối đa tư chất?',
      'Làm thế nào để xây dựng đội ngũ kế cận trung thành và sáng tạo trong công việc?',
    ],
    oppositePalaceName: 'Điền Trạch',
    trinePalaceNames: ['Phụ Mẫu', 'Nô Bộc'],
    adjacentPalaceNames: ['Tài Bạch', 'Phu Thê'],
    evaluationRule:
      'Đối xung Điền Trạch; quan sát tính chất tinh hệ để định hướng sinh nở và dạy dỗ, tránh áp đặt cái tôi lên con cái; nếu có sát tinh thì nên sinh muộn hoặc cho con tự lập sớm.',
  },

  'Phu Thê': {
    name: 'Phu Thê',
    alias: 'Hôn Nhân & Bạn Đời Tri Kỷ',
    lifeDomain: 'Tình cảm lứa đôi, đời sống hôn nhân, tính cách bạn đời và sự gắn kết',
    coreMeaning:
      'Thể hiện nhân duyên vợ chồng, tính cách và hoàn cảnh xuất thân của người bạn đời, mức độ hòa hợp và các khúc mắc tình cảm cần chuyển hóa. Tam phương tứ chính của Phu Thê gồm Phúc Đức, Sự Nghiệp và Thiên Di, cho thấy hôn nhân chi phối trực tiếp đến tinh thần và công danh của đời người.',
    counselingFocus:
      'Xây dựng sự thấu cảm sâu sắc, học cách lắng nghe và chấp nhận sự khác biệt của đối phương, nuôi dưỡng tình yêu thương bằng lòng tôn trọng và sự bao dung.',
    keyQuestions: [
      'Tính cách và phẩm chất nổi bật của người bạn đời đồng hành cùng tôi là gì?',
      'Đâu là nguyên nhân gốc rễ của những mâu thuẫn trong tình cảm và cách tháo gỡ?',
      'Làm thế nào để giữ lửa hôn nhân và cùng nhau kiến tạo một tổ ấm bình an?',
    ],
    oppositePalaceName: 'Quan Lộc',
    trinePalaceNames: ['Phúc Đức', 'Thiên Di'],
    adjacentPalaceNames: ['Tử Tức', 'Huynh Đệ'],
    evaluationRule:
      'Nguyên tắc Trung Châu Phái: Phải kết hợp xem xét đồng thời Mệnh Thân; Cát diệu chưa hẳn toàn cát (như Xương Khúc có thể ngoại tình), Sát diệu chưa hẳn toàn hung (Đà La ngộ Lộc Mã thì bạn đời bôn ba phát tài xứ người).',
  },

  'Huynh Đệ': {
    name: 'Huynh Đệ',
    alias: 'Anh Em & Bằng Hữu Đồng Môn',
    lifeDomain: 'Mối quan hệ anh chị em ruột, bạn bè đồng môn và đối tác sơ khởi',
    coreMeaning:
      'Chủ về tình cảm ruột thịt, sự đùm bọc, giúp đỡ hay tranh chấp giữa anh chị em trong nhà. Trong xã hội hiện đại, cung Huynh Đệ còn mở rộng sang các mối quan hệ bạn bè thân thiết cùng chí hướng, bạn đồng môn và các đối tác đồng sáng lập trong giai đoạn khởi nghiệp ban đầu.',
    counselingFocus:
      'Gìn giữ hòa khí ruột thịt, minh bạch trong các vấn đề lợi ích tài chính và tận dụng sức mạnh gắn kết của tình thân để cùng phát triển.',
    keyQuestions: [
      'Mối quan hệ giữa tôi và anh chị em mang lại sự trợ lực hay thử thách gì?',
      'Tôi có nên hợp tác làm ăn chung với anh em ruột hoặc bạn bè thân thiết không?',
      'Cách giữ gìn hòa khí gia đình khi có sự chênh lệch về điều kiện kinh tế?',
    ],
    oppositePalaceName: 'Nô Bộc',
    trinePalaceNames: ['Điền Trạch', 'Tật Ách'],
    adjacentPalaceNames: ['Phu Thê', 'Mệnh'],
    evaluationRule:
      'Đối xung Nô Bộc; phàm thấy Hình Kỵ hay Thiên Vu thì hết sức tránh tranh chấp phân chia tài sản thừa kế; thấy Phụ Bật, Khôi Việt chủ anh em đồng tâm hiệp lực hưng gia.',
  },
}
