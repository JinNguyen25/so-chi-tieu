// Từ điển tiếng Nhật cho Sổ Chi Tiêu (日本語辞書).
// re: quy tắc regex cho câu có số liệu (chạy trước, theo thứ tự)
// ph: cụm từ cố định (thay thế theo cụm dài trước)
// words: từ đơn ngắn (chỉ thay khi đứng riêng, không nằm trong từ khác)
window.I18N_JA = {
re: [
  // ngày/tháng: dd/mm → mm/dd (kiểu Nhật), thứ trong tuần, tháng/năm
  [/(?<![\d\/])(\d\d)\/(\d\d)(?![\d\/])/g, '$2/$1'],
  [/(CN|T[2-7]), (\d\d\/\d\d)/g, (m, w, d) => d + '(' + ({CN:'日',T2:'月',T3:'火',T4:'水',T5:'木',T6:'金',T7:'土'})[w] + ')'],
  [/Báo cáo chi tiêu tháng (\d+)\/(\d+)/g, '$2年$1月の支出レポート'],
  [/Tháng (\d+)\/(\d+)/g, '$2年$1月'],
  [/Tạo ngày (\S+)/g, '作成日 $1'],

  // nhận xét thông minh
  [/Danh mục tốn nhất: <b>(.+?)<\/b> \((.+?), (\d+)% tổng chi\)\./g, '最も支出が多い費目: <b>$1</b>（$2、全体の$3%）。'],
  [/So với tháng trước: chi (tăng|giảm) <b>(\d+)%<\/b> \((.+?) → (.+?)\)\./g, (m, d, p, a, b) => '先月比: 支出が<b>' + p + '%</b>' + (d === 'tăng' ? '増加' : '減少') + '（' + a + ' → ' + b + '）。'],
  [/Với tốc độ này, cuối tháng bạn sẽ chi khoảng <b>(.+?)<\/b>(?: — <span class="exp">vượt (.+?)<\/span> so với hạn mức!|\.)/g, (m, a, over) => 'このペースだと月末の支出は約<b>' + a + '</b>になります' + (over ? '——上限を<span class="exp">' + over + '超過</span>する見込みです！' : '。')],
  [/Khoản chi lớn nhất: <b>(.+?)<\/b> — (.+?) \((\d\d\/\d\d)\)\./g, '最大の支出: <b>$1</b> — $2（$3）。'],
  [/Có <b>(\d+)<\/b> khoản chi nhỏ \(≤¥1,000\) cộng lại thành <b>(.+?)<\/b> — “con muỗi” cũng đốt tiền đấy\./g, '¥1,000以下の小さな支出が<b>$1</b>件、合計<b>$2</b>。塵も積もれば山となります。'],
  [/<b>(.+?)<\/b> đã vượt ngân sách \((\d+)%\)\./g, '<b>$1</b>は予算を超過しました（$2%）。'],
  [/<b>(.+?)<\/b> đã dùng (\d+)% ngân sách\./g, '<b>$1</b>は予算の$2%を使用しました。'],
  [/Bạn tiết kiệm được (-?\d+)% thu nhập — rất tốt!/g, '収入の$1%を貯蓄できています。素晴らしい！'],
  [/Tỷ lệ tiết kiệm (-?\d+)%\. Quy tắc 50\/30\/20 khuyên tối thiểu 20%\./g, '貯蓄率は$1%です。50/30/20ルールでは最低20%が目安です。'],

  // hôm nay tiêu được bao nhiêu
  [/Còn (\S+) cho (\d+) ngày nữa\. Hôm nay đã tiêu (\S+?)(?: \((\d+)% hạn mức\))?\./g, (m, left, d, spent, p) => '残り' + left + '、あと' + d + '日。今日はすでに' + spent + '使用' + (p ? '（上限の' + p + '%）' : '') + '。'],
  [/(Còn dư|Vượt) so với (ngân sách|thu nhập) tháng này\./g, (m, a, b) => '今月の' + b + 'に対して' + (a === 'Còn dư' ? '余裕があります。' : '超過しています。')],
  [/(¥[\d,]+) \/ ngày/g, '$1 / 日'],
  [/· chi (\S+)/g, '· 支出 $1'],

  // ví / thẻ
  [/Số dư ban đầu (\S+)/g, '初期残高 $1'],
  [/Hạn mức (\S+) · còn dùng được <b>(\S+)<\/b> \((\d+)% đã dùng\)/g, '限度額 $1 ・ 利用可能額 <b>$2</b>（$3%使用）'],
  [/Kỳ đã chốt ngày <b>(.+?)<\/b>: (\S+)(?: · trả trước <b>(.+?)<\/b> \(còn (\d+) ngày\), cần trả <b>(\S+)<\/b>| · đã qua hạn trả)/g,
    (m, c, amt, pay, d, due) => '締め日 <b>' + c + '</b> 確定分: ' + amt + (pay ? ' ・ 支払期限 <b>' + pay + '</b>（あと' + d + '日）、支払額 <b>' + due + '</b>' : ' ・ 支払期限は過ぎました')],
  [/Kỳ đang chạy \(chốt (.+?)\): (\S+)/g, '今回の利用分（締め日 $1）: $2'],
  [/: cần trả <b>(\S+)<\/b> trước ngày (\S+) \((hôm nay|còn (\d+) ngày)\)\./g, (m, due, d, w, n) => '：支払額 <b>' + due + '</b>、期限 ' + d + '（' + (w === 'hôm nay' ? '本日' : 'あと' + n + '日') + '）。'],
  [/(Vượt|Còn) (-?¥[\d,]+) \((\d+)%\)/g, (m, a, amt, p) => (a === 'Vượt' ? '超過 ' : '残り ') + amt + '（' + p + '%）'],

  // nhóm chia tiền
  [/>([^<>]+?) trả · chia ([^<]+)</g, '>$1が支払い ・ 分担: $2<'],
  [/(được nhận|cần trả) (\S+)/g, (m, a, amt) => (a === 'được nhận' ? '受取 ' : '支払 ') + amt],
  [/• (.+?) chuyển cho (.+?): (\S+)/g, '• $1 → $2: $3'],
  [/Ghi phần của (.+?) vào sổ chi tiêu cá nhân/g, '$1の分を個人の家計簿にも記録する'],

  // thử thách
  [/Thử thách kết thúc, bạn phá lệ (\d+) ngày\. Thử lại nhé!/g, 'チャレンジ終了。$1日破ってしまいました。もう一度挑戦しましょう！'],
  [/Đã phá lệ (\d+) ngày\. Chuỗi thắng tính lại từ lần gần nhất\./g, '$1日ルールを破りました。連続記録は直近の失敗から数え直します。'],
  [/Danh mục theo dõi: (.+?) · bắt đầu (\S+)/g, '対象費目: $1 ・ 開始日 $2'],
  [/^\s*ngày\s*$/g, '日'],
  [/^ngày (\d+)$/g, '$1日'],

  // báo cáo
  [/\((\+?-?\d+)% so với tháng trước\)/g, '（先月比 $1%）'],
  [/(\d+)% của (-?¥[\d,]+)/g, '予算$2の$1%'],

  // nhập nhanh / quét hoá đơn / đồng bộ
  [/✅ Đã (thêm|lưu) (\S+) — (.+)/g, (m, a, amt, c) => '✅ ' + amt + 'を' + (a === 'thêm' ? '追加' : '保存') + 'しました — ' + c],
  [/✅ Đã thêm (\d+) khoản từ hoá đơn \((\S+)\)/g, '✅ レシートから$1件を追加しました（$2）'],
  [/Thêm (\S+) còn lại \(thuế\/phí\) thành 1 khoản “Khác”/g, '残りの$1（税・手数料）を「その他」の1件として追加'],
  [/Đã đăng nhập: <b>(.+?)<\/b>/g, 'ログイン中: <b>$1</b>'],
  [/✅ Đồng bộ lúc (\S+)/g, '✅ 同期済み $1'],
  [/Ngày (\d+) hằng tháng/g, '毎月$1日'],
  [/✅ Đã gửi email đặt lại mật khẩu tới (\S+?)\. Kiểm tra cả mục Thư rác\./g, '✅ パスワード再設定メールを $1 に送信しました。迷惑メールフォルダも確認してください。'],
  [/Đã lưu khoá \(••••(\w+)\)\. Dán khoá mới để thay\./g, 'キーは保存済みです（••••$1）。置き換える場合は新しいキーを貼り付けてください。'],
],
ph: [
  // --- tên app, tab
  ['Sổ Chi Tiêu', '家計簿'], ['Sáng/Tối', 'ライト/ダーク'],
  ['Tổng quan', '概要'], ['Giao dịch lặp hằng tháng', '毎月の定期支出'], ['Giao dịch', '取引'],
  ['Ngân sách tháng (hạn mức từng danh mục)', '月間予算（費目ごとの上限）'], ['Ngân sách', '予算'], ['ngân sách', '予算'],
  ['Chia nhóm', '割り勘'], ['Mục tiêu', '目標'], ['Báo cáo', 'レポート'], ['Cài đặt', '設定'],
  ['thu nhập', '収入'],

  // --- banner
  ['🔔 Hôm nay bạn chưa ghi chép khoản nào. Nhập ngay cho khỏi quên nhé!', '🔔 今日はまだ記録がありません。忘れないうちに入力しましょう！'],
  ['Hôm nay bạn chưa ghi chép khoản nào 📝', '今日はまだ記録がありません 📝'],
  ['Bỏ qua', 'あとで'],
  ['🆕 Có bản cập nhật mới của app.', '🆕 アプリの新しいバージョンがあります。'],
  ['Cập nhật ngay', '今すぐ更新'],

  // --- nhập nhanh
  ['500 bento · 3k · 1.5man (=15000)', '500 お弁当 · 3k · 1.5万 (=15000)'],
  ['Mẹo: gõ “500 bento” vào ô số tiền rồi Enter — app tự tách số tiền, ghi chú và đoán danh mục.', 'ヒント: 金額欄に「500 お弁当」のように入力してEnterを押すと、金額・メモ・費目を自動で分けます。'],
  ['Thanh toán bằng', '支払方法'], ['Ghi chú (vd: Rút ATM)', 'メモ（例: ATM引き出し）'], ['Ghi chú', 'メモ'],
  ['Lưu thay đổi', '変更を保存'], ['Huỷ sửa', '編集をやめる'],
  ['📷 Thêm ảnh', '📷 写真を追加'], ['Ảnh để nhớ khoản chi. Quét hoá đơn hoặc ảnh chụp lịch sử giao dịch (Apple Wallet, app ngân hàng) để AI tách từng dòng và phân loại.', '写真で支出を思い出せます。レシートや取引履歴（Apple Wallet・銀行アプリ）のスクリーンショットをスキャンすると、AIが1件ずつ分類します。'],
  ['⚠ Có thể đã nhập rồi (trùng ngày và số tiền)', '⚠ 入力済みの可能性があります（日付・金額が同じ）'],
  ['Danh sách giao dịch: kiểm tra ngày, loại thu/chi, danh mục và số tiền. Dòng có ⚠ có thể đã nhập rồi nên đang được bỏ tick.', '取引一覧です。日付・収支・費目・金額を確認してください。⚠の行は入力済みの可能性があるため、チェックを外してあります。'],
  ['🧾 Quét hoá đơn (AI)', '🧾 レシートをスキャン (AI)'], ['Bỏ ảnh', '写真を削除'],
  ['✎ Đang sửa một giao dịch', '✎ 取引を編集中'],
  ['Số tiền chưa hợp lệ. Thử: 500, 3k, 1.5man (=¥15,000)', '金額が正しくありません。例: 500、3k、1.5万（=¥15,000）'],
  ['Xoá giao dịch này?', 'この取引を削除しますか？'],

  // --- tổng quan
  ['Tổng tài sản (các ví)', '総資産（全口座）'], ['Hôm nay tiêu được bao nhiêu?', '今日使える金額は？'],
  ['Chi theo phương thức thanh toán', '支払方法別の支出'], ['Chi theo danh mục', '費目別の支出'], ['Chi theo ngày', '日別の支出'],
  ['Nhận xét thông minh', 'スマートコメント'], ['Chưa có chi tiêu.', '支出はまだありません。'], ['Chưa có chi tiêu', '支出なし'],
  ['Thêm vài giao dịch để nhận xét tự động.', '取引を何件か追加すると自動でコメントが表示されます。'],
  ['Đặt ngân sách ở tab “Ngân sách” hoặc thêm khoản thu để tính hạn mức mỗi ngày.', '「予算」タブで予算を設定するか収入を追加すると、1日の上限を計算します。'],
  ['Còn lại', '残り'],

  // --- danh mục
  ['Ăn uống', '食費'], ['Đi chợ / Siêu thị', '食料品・スーパー'], ['Đi lại', '交通費'], ['Nhà & Hoá đơn', '住居・光熱費'],
  ['Mua sắm', '買い物'], ['Giải trí', '娯楽'], ['Sức khoẻ', '健康・医療'], ['Học tập', '学習'], ['Khác', 'その他'],
  ['Lương / Thu nhập', '給与・収入'],
  // --- ví mặc định
  ['Thẻ ghi nợ / Ngân hàng', 'デビットカード／銀行'], ['Ngân hàng / thẻ ghi nợ', '銀行／デビットカード'],
  ['Ví điện tử (PayPay…)', '電子マネー（PayPay等）'], ['Ví điện tử', '電子マネー'], ['Thẻ tín dụng', 'クレジットカード'], ['Tiền mặt', '現金'],
  ['(ví đã xoá)', '(削除された口座)'],

  // --- danh sách giao dịch
  ['Tìm theo ghi chú…', 'メモで検索…'], ['Mọi danh mục', 'すべての費目'], ['Mọi ví', 'すべての口座'], ['Tất cả', 'すべて'],
  ['Chỉ chi', '支出のみ'], ['Chỉ thu', '収入のみ'], ['Chuyển ví', '口座間移動'], ['Chưa có giao dịch nào.', '取引はまだありません。'],

  // --- ví
  ['Chuyển ví không tính là thu hay chi.', '口座間の移動は収入にも支出にも含まれません。'],
  ['Chuyển tiền giữa các ví', '口座間の資金移動'], ['Số tiền (vd: 5k)', '金額（例: 5k）'],
  ['Chọn 2 ví khác nhau', '異なる2つの口座を選んでください'], ['Nhập số tiền hợp lệ', '有効な金額を入力してください'],
  ['Sửa thẻ / ví', 'カード／口座を編集'], ['Sửa số dư / cài đặt', '残高・設定を編集'],
  ['Tên (vd: PayPay, Yucho, Rakuten Card)', '名前（例: PayPay、ゆうちょ、楽天カード）'],
  ['Số dư ban đầu (vd: 50k)', '初期残高（例: 50k）'], ['Số dư ban đầu', '初期残高'],
  ['Dư nợ hiện tại (vd: 3man, 0 nếu chưa nợ)', '現在の借入残高（例: 3万、未使用なら0）'],
  ['Hạn mức thẻ (vd: 30man)', 'カード限度額（例: 30万）'], ['Hạn mức không hợp lệ', '限度額が正しくありません'], ['Hạn mức', '限度額'],
  ['Chu kỳ chốt sao kê / thanh toán (đã điền sẵn theo mặc định của đa số thẻ ở Nhật, bạn thường không cần sửa):', '締め日・支払日のサイクル（日本の多くのカードの標準設定を入力済みです。通常は変更不要）:'],
  ['Mặc định: chốt cuối tháng, trả ngày 27 tháng sau (Rakuten, PayPay Card)', '標準: 月末締め・翌月27日払い（楽天カード、PayPayカード）'],
  ['SMBC (Mitsui Sumitomo): chốt cuối tháng, trả ngày 26 tháng sau', '三井住友カード: 月末締め・翌月26日払い'],
  ['SMBC / JCB / d Card: chốt ngày 15, trả ngày 10 tháng sau', '三井住友カード／JCB／dカード: 15日締め・翌月10日払い'],
  ['AEON: chốt ngày 10, trả ngày 2 tháng sau', 'イオンカード: 10日締め・翌月2日払い'],
  ['Epos: chốt ngày 4, trả ngày 4 tháng sau', 'エポスカード: 4日締め・翌月4日払い'],
  ['Epos: chốt ngày 27, trả ngày 27 tháng sau', 'エポスカード: 27日締め・翌月27日払い'],
  ['Tự nhập ngày…', '日付を自分で入力…'],
  ['Trả ngày', '支払日'], ['cuối tháng', '月末'], ['tháng sau', '翌月'], ['cùng tháng', '当月'],
  ['Thông tin chu kỳ lấy từ các trang tổng hợp trên mạng, bạn đối chiếu với sao kê thật. Nếu ngày trả rơi vào cuối tuần/ngày lễ thì ngân hàng trừ vào ngày làm việc kế tiếp (app chưa tính). “Dư nợ hiện tại” nhập ở ô số dư ban đầu (số dương).',
   '締め日・支払日の情報はネット上のまとめサイトによるものです。実際の明細と照らし合わせてください。支払日が土日祝の場合は翌営業日に引き落とされます（アプリでは未対応）。「現在の借入残高」は初期残高欄に正の数で入力します。'],
  ['Khi trả nợ thẻ, dùng “Chuyển tiền giữa các ví” từ ví ngân hàng sang thẻ này (không tính là chi tiêu).', 'カードの支払いは、銀行口座からこのカードへ「口座間の資金移動」で行います（支出には含まれません）。'],
  ['Trả nợ thẻ', 'カード返済'], ['Dư nợ', '借入残高'], ['Đóng', '閉じる'],
  ['Phải còn ít nhất 1 ví.', '口座は最低1つ必要です。'],
  ['Ví này đã có giao dịch nên không xoá được. Hãy xoá hoặc chuyển giao dịch trước.', 'この口座には取引があるため削除できません。先に取引を削除または移動してください。'],
  ['Xoá ví này?', 'この口座を削除しますか？'], ['Nhập tên', '名前を入力してください'],
  ['Số tiền không hợp lệ', '金額が正しくありません'],

  // --- ngân sách
  ['Để trống = không giới hạn. Tổng hạn mức dùng để tính “hôm nay tiêu được bao nhiêu”.', '空欄＝上限なし。上限の合計は「今日使える金額」の計算に使われます。'],

  // --- nhóm
  ['Tạo nhóm chia tiền', '割り勘グループを作成'], ['Tên nhóm (vd: Đi Kyoto)', 'グループ名（例: 京都旅行）'],
  ['Thành viên, cách nhau dấu phẩy. Người đầu tiên là bạn. VD: Tôi, Nam, Lan', 'メンバー（カンマ区切り）。最初の人があなたです。例: 私, ナム, ラン'],
  ['Chưa có nhóm nào. Tạo nhóm để chia tiền đi chơi, tiền nhà…', 'グループがありません。旅行や家賃の割り勘用に作成しましょう…'],
  ['📋 Sao chép kết quả', '📋 結果をコピー'], ['✅ Đã chép', '✅ コピーしました'], ['Sao chép nội dung:', '内容をコピー:'],
  ['➕ Thêm khoản chi', '➕ 支出を追加'], ['Nội dung (vd: Tiền phòng)', '内容（例: 宿泊代）'], ['Số tiền (vd: 12k)', '金額（例: 12k）'],
  ['Ai trả:', '支払った人:'], ['Chia cho:', '分担する人:'], ['Số dư từng người', 'メンバーごとの残高'],
  ['Cách thanh toán gọn nhất', '最も少ない送金回数での精算方法'], ['✅ Huề, không ai nợ ai.', '✅ 貸し借りなしです。'],
  ['đều cả nhóm', '全員で均等'], ['Xoá nhóm này?', 'このグループを削除しますか？'],
  ['Nhập tên nhóm và ít nhất 2 thành viên (cách nhau dấu phẩy).', 'グループ名と2人以上のメンバー（カンマ区切り）を入力してください。'],
  ['Nhập nội dung, số tiền hợp lệ và chọn ít nhất 1 người chia.', '内容と有効な金額を入力し、分担する人を1人以上選んでください。'],
  ['Mọi người đã huề tiền ✅', '全員精算済みです ✅'], ['· Tổng chi', '・ 合計支出'], ['Tổng chi:', '合計支出:'],

  // --- mục tiêu / thử thách
  ['🏆 Thử thách', '🏆 チャレンジ'],
  ['Thử thách bản thân nhịn một thói quen tốn tiền. Mỗi ngày không có khoản chi nào ở danh mục đã chọn là một ngày thắng.', 'つい使ってしまう習慣を我慢するチャレンジです。選んだ費目の支出がない日は「勝ち」の日になります。'],
  ['30 ngày không mua đồ online', '30日間ネットショッピングをしない'],
  ['Thường chi bao nhiêu/tháng cho mục này? (vd: 10k)', 'この費目の月の支出額は？（例: 10k）'],
  ['Bắt đầu lại từ hôm nay?', '今日からやり直しますか？'], ['Bắt đầu lại từ hôm nay', '今日からやり直す'], ['Bắt đầu', '開始'],
  ['Ngày thắng', '勝った日'], ['Chuỗi hiện tại', '連続記録'], ['Tiền nhịn được', '我慢して浮いた金額'],
  ['Huỷ thử thách?', 'チャレンジを中止しますか？'], ['Huỷ thử thách', 'チャレンジを中止'],
  ['🎉 Hoàn thành xuất sắc, không phá lệ ngày nào!', '🎉 見事達成！1日も破りませんでした！'],
  ['💪 Chưa phá lệ ngày nào, giữ vững nhé!', '💪 まだ1日も破っていません。この調子で！'],
  ['🎉 Hoàn thành!', '🎉 達成！'],
  ['Thêm mục tiêu tiết kiệm', '貯蓄目標を追加'], ['Tên (vd: Mua laptop)', '名前（例: ノートPC購入）'],
  ['Số tiền cần (vd: 200k)', '必要な金額（例: 200k）'], ['Nạp thêm (vd: 500k)', '追加入金（例: 5k）'],
  ['Xoá mục tiêu?', 'この目標を削除しますか？'],
  ['Nhập tên và số tiền mục tiêu (vd: 200k)', '名前と目標金額（例: 200k）を入力してください'], ['Nhập tên và số tiền', '名前と金額を入力してください'],

  // --- báo cáo
  ['🖨️ In / Lưu thành PDF', '🖨️ 印刷 / PDFで保存'], ['Trong hộp thoại in, chọn “Lưu dưới dạng PDF”.', '印刷ダイアログで「PDFに保存」を選んでください。'],
  ['Tổng thu', '収入合計'], ['Tổng chi', '支出合計'], ['Chênh lệch', '収支差'], ['Chi trung bình / ngày', '1日あたりの平均支出'],
  ['Số giao dịch', '取引数'], ['Danh mục', '費目'], ['Số tiền', '金額'], ['Tỷ lệ', '割合'],
  ['5 khoản chi lớn nhất', '支出トップ5'], ['Số dư các ví hiện tại', '現在の口座残高'], ['Nhận xét', 'コメント'],
  ['Không có chi tiêu.', '支出がありません。'],

  // --- cài đặt: đồng bộ
  ['☁️ Đồng bộ giữa các thiết bị', '☁️ 端末間の同期'], ['Đang kết nối…', '接続中…'], ['Đang đồng bộ…', '同期中…'],
  ['Đăng nhập để dữ liệu tự đồng bộ giữa điện thoại và máy tính. Dữ liệu hiện có trên máy này sẽ được gộp lên tài khoản.', 'ログインすると、スマホとパソコンの間でデータが自動で同期されます。この端末の既存データはアカウントに統合されます。'],
  ['Mật khẩu (≥6 ký tự)', 'パスワード（6文字以上）'], ['Đăng nhập', 'ログイン'], ['Tạo tài khoản', 'アカウント作成'],
  ['Quên mật khẩu?', 'パスワードを忘れた場合'], ['Đăng xuất? Dữ liệu vẫn còn trên máy này.', 'ログアウトしますか？この端末のデータは残ります。'],
  ['Đăng xuất', 'ログアウト'], ['Đồng bộ ngay', '今すぐ同期'],
  ['Sai email hoặc mật khẩu', 'メールアドレスまたはパスワードが違います'], ['Sai mật khẩu', 'パスワードが違います'],
  ['Chưa có tài khoản này', 'このアカウントはありません'], ['Email đã được đăng ký, hãy đăng nhập', 'このメールアドレスは登録済みです。ログインしてください'],
  ['Mật khẩu cần ít nhất 6 ký tự', 'パスワードは6文字以上必要です'], ['Email không hợp lệ', 'メールアドレスが正しくありません'],
  ['Tên miền này chưa được thêm vào Authorized domains trong Firebase', 'このドメインはFirebaseのAuthorized domainsに追加されていません'],
  ['Nhập email của bạn vào ô Email trước, rồi bấm lại “Quên mật khẩu?”.', '先にメールアドレス欄に入力してから、もう一度「パスワードを忘れた場合」を押してください。'],
  ['Chưa đồng bộ được:', '同期できませんでした:'], ['Lỗi đồng bộ:', '同期エラー:'], ['chưa đặt Rules trong Firestore', 'FirestoreのRulesが未設定です'],
  ['Không tải được Firebase (đang offline?). Dữ liệu vẫn lưu trên máy này.', 'Firebaseを読み込めません（オフライン？）。データはこの端末に保存されています。'],
  ['Chưa bật. Làm theo file', 'まだ有効ではありません。ファイル'], [', rồi dán cấu hình vào', 'の手順に従い、設定を'], [' và đưa lại thư mục lên hosting.', 'に貼り付けて、フォルダをホスティングに再アップロードしてください。'],

  // --- cài đặt: app, nhắc, dữ liệu
  ['Cài đặt app', 'アプリ設定'], ['📲 Cài lên màn hình chính', '📲 ホーム画面に追加'],
  ['Android: menu Chrome ⋮ → “Cài đặt ứng dụng”. iPhone/iPad: mở bằng Safari → nút Chia sẻ ⬆ → “Thêm vào MH chính”.', 'Android: Chromeのメニュー ⋮ →「アプリをインストール」。iPhone/iPad: Safariで開く → 共有ボタン ⬆ →「ホーム画面に追加」。'],
  ['Đã cài app ✅', 'インストール済み ✅'], ['Bạn đang dùng bản đã cài ✅', 'インストール版を使用中 ✅'],
  ['Nhắc ghi chép mỗi ngày', '毎日の記録リマインダー'], ['Bật nhắc', 'リマインダーをオン'],
  ['Nhắc hiện khi bạn mở app sau giờ đã đặt mà chưa có giao dịch nào trong ngày (kèm thông báo nếu bạn cho phép). Web app không thể tự “đánh thức” khi đã đóng hẳn, nên hãy để app mở nền hoặc ghim lên màn hình chính.',
   '設定した時刻を過ぎてアプリを開いたとき、その日の取引がまだなければリマインドを表示します（許可すれば通知も送ります）。ウェブアプリは完全に閉じた状態では自動で起動できないため、バックグラウンドで開いたままにするか、ホーム画面に追加してください。'],
  ['⬇ Sao lưu (JSON)', '⬇ バックアップ (JSON)'], ['⬇ Xuất CSV', '⬇ CSV出力'], ['⬆ Khôi phục', '⬆ 復元'],
  ['Dữ liệu lưu trong trình duyệt của thiết bị này. Nhớ sao lưu định kỳ, nhất là trước khi xoá dữ liệu trình duyệt.', 'データはこの端末のブラウザに保存されます。ブラウザのデータを消去する前など、定期的にバックアップしてください。'],
  ['Dữ liệu', 'データ'], ['Ghi đè dữ liệu hiện tại bằng bản sao lưu?', '現在のデータをバックアップで上書きしますか？'],
  ['File không hợp lệ', 'ファイルが正しくありません'], ['Không lưu được dữ liệu!', 'データを保存できません！'],
  ['Tên (vd: Tiền nhà, Netflix)', '名前（例: 家賃、Netflix）'], ['Số tiền (vd: 60k)', '金額（例: 60k）'],
  ['Lặp vào ngày', '毎月'], ['hằng tháng', '日に自動記録'],
  ['Tháng nào không có ngày đó (vd: 31) thì tính vào cuối tháng.', 'その日がない月（例: 31日）は月末に記録されます。'],
  ['Chưa có khoản lặp nào.', '定期支出はまだありません。'], ['(lặp)', '(定期)'],
  ['Nguy hiểm', '危険な操作'], ['Xoá toàn bộ dữ liệu', 'すべてのデータを削除'],
  ['Xoá TOÀN BỘ dữ liệu? Không thể hoàn tác.', 'すべてのデータを削除しますか？元に戻せません。'], ['Chắc chắn chứ?', '本当によろしいですか？'],

  // --- phiên bản
  ['Phiên bản & cập nhật', 'バージョンと更新'], ['Phiên bản', 'バージョン'], ['Kiểm tra cập nhật', '更新を確認'],
  ['Đang kiểm tra…', '確認中…'], ['✅ Bạn đang dùng bản mới nhất.', '✅ 最新バージョンです。'],
  ['Không kiểm tra được (có thể đang offline).', '確認できません（オフラインかもしれません）。'],
  ['🆕 Có bản mới', '🆕 新しいバージョン'], ['. Bấm “Cập nhật ngay” ở đầu trang.', '。ページ上部の「今すぐ更新」を押してください。'],

  // --- AI / quét hoá đơn
  ['🧾 Quét hoá đơn bằng AI', '🧾 AIレシートスキャン'],
  ['Ảnh hoá đơn được gửi tới Google Gemini để đọc; gói miễn phí của Google có thể dùng dữ liệu để cải thiện sản phẩm, nên đừng quét hoá đơn có thông tin nhạy cảm (số thẻ, tên, địa chỉ).', 'レシート画像はGoogle Geminiに送信されて読み取られます。無料プランではGoogleがデータを製品改善に利用する場合があるため、カード番号・氏名・住所などが写るレシートはスキャンしないでください。'],
  ['Nâng cao: dùng khoá Gemini riêng của bạn', '詳細設定: 自分のGeminiキーを使う'],
  ['Chỉ cần khi không dùng Firebase AI Logic. Lấy khoá miễn phí tại', 'Firebase AI Logicを使わない場合のみ必要です。無料キーの取得先:'],
  ['. Khoá chỉ lưu trên thiết bị này (không đồng bộ, không nằm trong sao lưu).', '。キーはこの端末にのみ保存されます（同期・バックアップ対象外）。'],
  ['Dán khoá Gemini API', 'Gemini APIキーを貼り付け'], ['Thử khoá', 'キーをテスト'], ['Xoá khoá', 'キーを削除'],
  ['✅ Đã lưu khoá trên thiết bị này.', '✅ この端末にキーを保存しました。'], ['Hãy dán khoá vào ô trên.', '上の欄にキーを貼り付けてください。'],
  ['Đã xoá khoá.', 'キーを削除しました。'], ['Chưa có khoá để thử.', 'テストするキーがありません。'], ['Đang thử…', 'テスト中…'],
  ['✅ Khoá hợp lệ.', '✅ キーは有効です。'], ['❌ Khoá không hợp lệ hoặc chưa được bật (mã', '❌ キーが無効か、有効化されていません（コード'],
  ['Không kết nối được (offline?).', '接続できません（オフライン？）。'],
  ['Đang dùng khoá Gemini riêng của bạn (đã lưu trên máy này).', '自分のGeminiキーを使用中（この端末に保存済み）。'],
  ['Đang dùng Firebase AI Logic: không cần nhập khoá. Chụp hoá đơn bằng nút “Quét hoá đơn (AI)” ở ô nhập.', 'Firebase AI Logicを使用中: キー入力は不要です。入力欄の「レシートをスキャン (AI)」ボタンで撮影してください。'],
  ['Chưa bật. Hãy bật Firebase AI Logic trong Firebase Console, hoặc dán khoá Gemini riêng ở mục Nâng cao.', '未設定です。Firebase ConsoleでFirebase AI Logicを有効にするか、詳細設定に自分のGeminiキーを貼り付けてください。'],
  ['🧾 Quét hoá đơn', '🧾 レシートスキャン'], ['⏳ Đang đọc hoá đơn… (vài giây)', '⏳ レシートを読み取り中…（数秒）'], ['🧾 Kết quả quét', '🧾 スキャン結果'],
  ['Kiểm tra lại từng món, sửa danh mục hoặc số tiền nếu AI đọc sai, bỏ tick món không muốn thêm.', '各品目を確認し、AIの読み取りが違う場合は費目や金額を直し、追加しない品目はチェックを外してください。'],
  ['Các món đã chọn:', '選択した品目:'], ['· tổng trên hoá đơn', '・ レシート合計'], ['Thêm vào chi tiêu', '支出に追加'],
  ['Chưa có món nào được chọn.', '品目が選択されていません。'], ['Thuế/phí', '税・手数料'],
  ['AI không trả kết quả (ảnh có thể quá mờ hoặc bị chặn).', 'AIから結果が返りませんでした（画像がぼやけているかブロックされた可能性があります）。'],
  ['AI trả về dữ liệu không đọc được, thử lại.', 'AIの返答を読み取れませんでした。もう一度お試しください。'],
  ['Khoá API không hợp lệ. Kiểm tra lại trong Cài đặt.', 'APIキーが無効です。設定を確認してください。'],
  ['Không kết nối được tới Gemini (đang offline?).', 'Geminiに接続できません（オフライン？）。'],
  ['Hạn mức miễn phí của AI đang hết hoặc quá tải. Hãy thử lại sau ít phút, hoặc sang ngày mai.', 'AIの無料枠が上限に達したか、混雑しています。数分後、または明日もう一度お試しください。'],
  ['Không quét được hoá đơn.', 'レシートをスキャンできませんでした。'], ['Không tải được Firebase AI (đang offline?).', 'Firebase AIを読み込めません（オフライン？）。'],
  ['Firebase App Check chưa được cấu hình (xem hướng dẫn bật quét hoá đơn). Chi tiết:', 'Firebase App Checkが未設定です（レシートスキャン有効化の手順を参照）。詳細:'],
  ['Firebase AI Logic chưa được bật cho project này. Vào Firebase Console → AI Logic → Get started → chọn Gemini Developer API. Chi tiết:', 'このプロジェクトでFirebase AI Logicが有効になっていません。Firebase Console → AI Logic → Get started → Gemini Developer API を選択してください。詳細:'],
  ['Không thấy món nào trên ảnh. Hãy chụp rõ, thẳng và đủ sáng rồi thử lại.', '写真に品目が見つかりません。はっきり・まっすぐ・明るく撮り直してください。'],
  ['Chưa có khoá Gemini.', 'Geminiキーがありません。'],
  ['Quét hoá đơn cần bật Firebase AI Logic hoặc khoá Gemini API (miễn phí). Mở phần cài đặt?', 'レシートスキャンにはFirebase AI Logicの有効化か、Gemini APIキー（無料）が必要です。設定を開きますか？'],
  ['Không đọc được ảnh này. Thử ảnh JPG/PNG khác.', 'この画像を読み込めません。別のJPG/PNGをお試しください。'],
],
words: [
  ['Thu', '収入'], ['Chi', '支出'], ['Ví', '口座'], ['Thêm', '追加'], ['Huỷ', 'キャンセル'], ['Lưu', '保存'],
  ['Xoá', '削除'], ['Sửa', '編集'], ['Tạo', '作成'], ['Chuyển', '移動'], ['Nạp', '入金'], ['Email', 'メールアドレス'],
  ['Ngày', '日付'], ['Loại', '種別'], ['Lỗi', 'エラー'], ['Hôm nay', '今日'], ['hôm nay', '今日'], ['ảnh', '写真'],
  ['Chốt', '締め'],
]
};
