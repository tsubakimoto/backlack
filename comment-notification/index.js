// 各種設定
const settings = require('./settings');

module.exports = function (context, data) {
    // modules
    const Enumerable = require('linq');

    // タイムスタンプのログの出力
    const timeStamp = new Date().toISOString();
    context.log('Webhook was triggered!', timeStamp);
    context.log('Input data was', data);

    // 課題キーの生成
    const getTicketKey = function(body) {
        const key = body.project.projectKey;
        const keyId = isPullRequest(body.content) ? body.content.issue.key_id : body.content.key_id;
        return key + '-' + keyId;
    }

    // 課題リンクの生成
    const getTicketUrl = function(ticketKey) {
        return settings.ticketUrl.replace('{key}', ticketKey);
    }

    // コメントのパーマネントリンクの生成
    const getCommentLink = function(body) {
        var c = body.content;
        var id = c.comment.id;

        if (isPullRequest(c)) {
            // プルリクエスト
            return settings.pullRequestUrl
                .replace('{key}', body.project.projectKey)
                .replace('{repo}', c.repository.name)
                .replace('{number}', c.number)
                .replace('{id}', id);
        } else if (c.comment !== null && 'id' in c.comment) {
            // チケット
            return settings.ticketCommentUrl
                .replace('{key}', getTicketKey(body))
                .replace('{id}', id);
        }
        return '';
    }

    // メンションテキストの作成
    const getMention = function(notifications) {
        if (notifications == null || notifications.length === 0) {
            return '';
        }

        return Enumerable.from(notifications).select(n => {return '@' + n.user.name}).toJoinedString(' ');
    }

    // 通知先のURLの作成
    const getIntegrationUrl = function(projectKey) {
        if (projectKey == null || !(projectKey in settings.channels)) {
            return '';
        }
        return settings.channels[projectKey];
    }

    // プルリクエストか否か
    const isPullRequest = function(content) {
        return 'issue' in content;
    }

    // ステータスの取得
    const getStatuses = function(content) {
        const values = [];
        const changes = Enumerable.from(content.changes);

        // コメント（Gitコミットは除く）
        const hasComment = 'comment' in content && 0 < content.comment.content.length;
        const hasCommit = changes.any("$.field === 'commit'");
        if (hasComment && !hasCommit) {
            values.push('操作: コメント追加');
        }

        // 本文の更新
        if (changes.any("$.field === 'description'")) {
            values.push('操作: 本文更新');
        }

        // 状態の変更
        const s = changes.firstOrDefault("$.field === 'status'");
        if (s !== null) {
            const o = settings.statuses[Number(s.old_value)];
            const n = settings.statuses[Number(s.new_value)];
            values.push(`状態変更: ${o} → ${n}`);
        }

        // 完了理由
        const r = changes.firstOrDefault("$.field === 'resolution'");
        if (r !== null) {
            const o = settings.resolutions[r.old_value];
            const n = settings.resolutions[r.new_value];
            values.push(`完了理由: ${o} → ${n}`);
        }

        // 担当者のアサイン
        const a = changes.firstOrDefault("$.field === 'assigner'");
        if (a !== null && 0 < a.new_value.length) {
            values.push(`担当者: @${a.new_value}`);
        }

        // 期限日
        const l = changes.firstOrDefault("$.field === 'limitDate'");
        if (l !== null && 0 < l.new_value.length) {
            values.push(`期限日: ${l.new_value}`);
        }

        return values.length === 0 ? null : {
            title: 'Status',
            value: values.join('\n'),
            short: true
        };
    }

    // フィールドの生成
    const getFields = function(body) {
        // 既定
        const fields = [
            {
                title: 'Key',
                value: getTicketKey(body),
                short: true
            }
        ];

        // 他のステータス
        const statuses = getStatuses(body.content);
        if (statuses !== null) {
            fields.push(statuses);
        }

        return fields;
    }

    // Slackへの送信データの生成
    const getSlackOptions = function(body) {
        const content = body.content;
        const commentLink = getCommentLink(body);
        const text = getMention(body.notifications);
        const url = getIntegrationUrl(body.project.projectKey);
        const fields = getFields(body);
        if (fields.length <= 1) {
            return null;
        }

        const payload = {
            attachments: [
                {
                    author_name: body.createdUser.name,
                    color: 'good',
                    title: content.summary,
                    title_link: commentLink,
                    text: content.comment.content,
                    fields: fields,
                    pretext: text
                }
            ],
            link_names: 1
        };

        return {
            url: url,
            form: 'payload=' + JSON.stringify(payload),
            json: true
        };
    }

    // Check webhook data
    if (data != null) {
        const body = data.body;
        const options = getSlackOptions(body);
        if (options !== null) {
            const request = require('request');
            request.post(options);
        }

        context.res = {
            status: 200,
            body: { message: 'Complete webhook' }
        };
    }
    else {
        context.res = {
            status: 400,
            body: { error: 'Please pass data in the input object'}
        };
    }

    context.done();
}
