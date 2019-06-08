'use strict';
const Service = require('egg').Service;

class backArticle extends Service {

    async articleList() {
        const { ctx } = this;
        let articles = null;
        try {
            articles = await ctx.model.Article.findAll({
                attributes: ['id', 'title', 'created_at', 'readnumber', 'top', 'status'],
                include: [
                    {
                        model: ctx.model.UserInfo,
                        attributes: ['id'],
                        include: [
                            {
                                model: ctx.model.User,
                                attributes: ['name'],
                            }
                        ],
                    },
                    {
                        model: ctx.model.Technology,
                        attributes: ['name']
                    }
                ]
            });
        } catch (e) {
            console.log('Error in backArticle service\'s articleList ');
            console.log(e);
        }
        return articles;
    }

    async deleteArticle(id) {
        const { ctx } = this;
        let succese = false;
        try {

            const user = await ctx.model.Article.findById(id);

            if (user) {
                await user.update({ status: 0 });
                succese = true;
            }
        } catch (e) {
            console.log('Error in backArticle service deleteArticle');
            console.log(e);
        }
        return succese;
    }
}
module.exports = backArticle;