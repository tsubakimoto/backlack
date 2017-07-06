// Replace {your-space} to your backlog space name.
exports.ticketUrl = 'https://{your-space}.backlog.jp/view/{key}';
exports.ticketCommentUrl = 'https://{your-space}.backlog.jp/view/{key}#comment-{id}';
exports.pullRequestUrl = 'https://{your-space}.backlog.jp/git/{key}/{repo}/pullRequests/{number}#comment-{id}';
exports.channels = {
};
exports.statuses = ['', '未対応', '処理中', '処理済み', '完了'];
exports.resolutions = {'': '(未設定)',  '0': '対応済み', '1': '対応しない', '2': '無効', '3': '重複', '4': '再現しない'};
