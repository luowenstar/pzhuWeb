'use strict';

const Controller = require('egg').Controller;

class Achievement extends Controller {
    async getAchievement() {
        const { ctx, app } = this;
        try {
            let { beg, end, index } = ctx.request.body;
            index = parseInt(index);
            const table = 'AchievementType';
            const table1 = 'Achievement';
            const params = {
                include: [
                    {
                        model: app.model.UserInfo,
                        attributes: ['avatar'],
                        include: [
                            {
                                model: app.model.User,
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            };
            let acType = await ctx.service.mysql.findAll({}, table);
            let ac = await ctx.service.mysql.findAll(params, table1);
            acType = await ctx.service.fun.filterTypeNum(acType, ac);
            ac = await ctx.service.fun.filterType(ac, index);
            if (ac.length >= end) {
                ac = ac.slice(beg, end);
            } else {
                ac = ac.slice(beg);
            }
            ctx.status = 200;
            ctx.body = {
                success: 1,
                data: {
                    ac,
                    acType
                }
            };
        } catch (err) {
            ctx.status = 404;
            console.log(err);
        }
    }
    async searchAchievement() {
        const { ctx, app } = this;
        const { Op } = app.Sequelize;
        try {
            const { value } = ctx.request.body;
            const table = 'Achievement';
            const params = {
                include: [
                    {
                        model: app.model.UserInfo,
                        attributes: ['avatar'],
                        include: [
                            {
                                model: app.model.User,
                                attributes: ['name']
                            }
                        ]
                    }
                ],
                order: [['id', 'DESC']],
                where: {
                    title: {
                        [Op.like]: '%' + value + '%',
                    },
                }
            };
            const ac = await ctx.service.mysql.findAll(params, table);
            ctx.status = 200;
            if (ac.length !== 0) {
                ctx.body = {
                    success: 1,
                    data: ac
                };
            } else {
                ctx.body = {
                    success: 0
                };
            }


        } catch (err) {
            console.log(err);
            ctx.status = 404;
        }
    }
}

module.exports = Achievement;
