backlack
===

(ja) [Backlog](http://www.backlog.jp/)での操作をSlackに通知する拡張機能です。

(en) This repository is Slack extension to notify operation in [Backlog](http://www.backlog.jp/).

# Usage
* Clone repository to your computer.

```
git clone https://github.com/tsubakimoto/backlack.git
```

* Edit `settings.js`. Replace `{your-space}` to your Backlog account name.

```js
exports.ticketUrl = 'https://{your-space}.backlog.jp/view/{key}';
exports.ticketCommentUrl = 'https://{your-space}.backlog.jp/view/{key}#comment-{id}';
exports.pullRequestUrl = 'https://{your-space}.backlog.jp/git/{key}/{repo}/pullRequests/{number}#comment-{id}';
```

* Write your Slack **Incoming-Webhook** configuration.

```js
exports.channels = {
    ProjectKey: Incoming-Webhook Url
};
```

* Deploy repository to Microsoft Azure Functions.

* Copy function url on Azure Functions' portal.

* Create webhook on Backlog and use copied url.

Choose hook event, for example, "Issue Commented", "Issue Updated", "Comment on Pull Request".

# Slack notification sample
![Sample image in Slack](https://raw.githubusercontent.com/wiki/tsubakimoto/backlack/images/slack-notification-sample.png)
