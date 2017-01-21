# backlack
(ja) [Backlog](http://www.backlog.jp/)での操作をSlackに通知する拡張機能です。

(en) This repository is Slack extension to notify operation in [Backlog](http://www.backlog.jp/).

# Usage
1. Clone repository to your computer.

```
git clone https://github.com/tsubakimoto/backlack.git
```

2. Edit `settings.js`. Replace `{your-space}` to your Backlog account name.

```js
exports.ticketUrl = 'https://{your-space}.backlog.jp/view/{key}';
exports.ticketCommentUrl = 'https://{your-space}.backlog.jp/view/{key}#comment-{id}';
exports.pullRequestUrl = 'https://{your-space}.backlog.jp/git/{key}/{repo}/pullRequests/{number}#comment-{id}';
```

3. Write your Slack **Incoming-Webhook** configuration.

```js
exports.channels = {
    ProjectKey: Incoming-Webhook Url
};
```

4. Deploy repository to Microsoft Azure Functions.

# Slack notification sample
[Sample image in Slack](https://raw.githubusercontent.com/wiki/tsubakimoto/backlack/images/slack-notification-sample.png)
