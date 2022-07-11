window.$ = window.jQuery = require('jquery');
const { HypixelColors, starColor, nameColor, swLVL } = require('./helpers.js');
const _class = '.popup_stats';
var $parent;

const PopupStats = {
    shownPlayer: null,
    removePopupTimer: 0,

    initialize: function() {
        $parent = $('#indexdiv');
        $parent.on('mouseleave', _class, () => {
            this.reset();
        }).on('mouseenter', _class, () => clearTimeout(PopupStats.removePopupTimer));
        $('#ign').on('mouseleave', () => {
            this.removePopupTimer = setTimeout(() => this.reset(), 2000);
        });
    },

    getBedwarsHTML: function(api, BWmode) {
        let ws = {
            color: HypixelColors.GREEN,
            count: api.stats.Bedwars[`${gmode}winstreak`]
        };
        if (ws.count === undefined) {
            ws.color = HypixelColors.DARK_RED; ws.count = '?';
        }
        try {return `
            <p>
                Network Level: <span style="color: ${HypixelColors.DARK_AQUA}">${NWL(api.networkExp)}</span><br><br>
                ${starColor(api.achievements.bedwars_level)}<br>
                Winstreak: <span style="color: ${ws.color}">${ws.count}</span><br><br>
                Final Kills: <span style="color: ${HypixelColors.GREEN}">${api.stats.Bedwars[`${gmode}final_kills_bedwars`]}</span><br>
                Final Deaths: <span style="color: ${HypixelColors.RED}">${api.stats.Bedwars[`${gmode}final_deaths_bedwars`]}</span><br>
                FKDR: <span style="color: ${HypixelColors.GOLD}">${parseFloat(api.stats.Bedwars[`${gmode}final_kills_bedwars`]/api.stats.Bedwars[`${gmode}final_deaths_bedwars`]).toFixed(3)}</span><br><br>
                Beds Broken: <span style="color: ${HypixelColors.GREEN}">${api.stats.Bedwars[`${gmode}beds_broken_bedwars`]}</span><br>
                Beds Lost: <span style="color: ${HypixelColors.RED}">${api.stats.Bedwars[`${gmode}beds_lost_bedwars`]}</span><br>
                BBLR: <span style="color: ${HypixelColors.GOLD}">${parseFloat(api.stats.Bedwars[`${gmode}beds_broken_bedwars`]/api.stats.Bedwars[`${gmode}beds_lost_bedwars`]).toFixed(3)}</span><br><br>
                Wins: <span style="color: ${HypixelColors.GREEN}">${api.stats.Bedwars[`${gmode}wins_bedwars`]}</span><br>
                Losses: <span style="color: ${HypixelColors.RED}">${api.stats.Bedwars[`${gmode}losses_bedwars`]}</span><br>
                WLR: <span style="color: ${HypixelColors.GOLD}">${parseFloat(api.stats.Bedwars[`${gmode}wins_bedwars`]/api.stats.Bedwars[`${gmode}losses_bedwars`]).toFixed(3)}</span>
            </p>
        `;} catch {return '<p style="color: red">ERROR LOADING STATS</p>'}
    },

    getSkywarsHTML: function(api) {
        let ws = {
            color: HypixelColors.GREEN,
            count: api.stats.SkyWars.win_streak
        };
        if (ws.count === undefined) {
            ws.color = HypixelColors.DARK_RED; ws.count = '?';
        }
        try {return `
            <p>
                Network Level: <span style="color: ${HypixelColors.DARK_AQUA}">${NWL(api.networkExp)}</span><br><br>
                ${starColor(swLVL(api.stats.SkyWars.skywars_experience))}<br>
                Winstreak: <span style="color: ${ws.color}">${ws.count}</span><br><br>
                Kills: <span style="color: ${HypixelColors.GREEN}">${api.stats.SkyWars.kills}</span><br>
                Deaths: <span style="color: ${HypixelColors.RED}">${api.stats.SkyWars.deaths}</span><br>
                KDR: <span style="color: ${HypixelColors.GOLD}">${parseFloat(api.stats.SkyWars.kills/api.stats.SkyWars.deaths).toFixed(3)}</span><br><br>
                Wins: <span style="color: ${HypixelColors.GREEN}">${api.stats.SkyWars.wins}</span><br>
                Losses: <span style="color: ${HypixelColors.RED}">${api.stats.SkyWars.losses}</span><br>
                WLR: <span style="color: ${HypixelColors.GOLD}">${parseFloat(api.stats.SkyWars.wins/api.stats.SkyWars.losses).toFixed(3)}</span>
            </p>
        `;} catch {return '<p style="color: red">ERROR LOADING STATS</p>'}
    },

    getDuelsHTML: function(api) {
        let ws = {
            color: HypixelColors.GREEN,
            count: api.stats.Duels.current_winstreak
        };
        if (ws.count === undefined) {
            ws.color = HypixelColors.DARK_RED; ws.count = '?';
        }
        try {return `
            <p>
                Network Level: <span style="color: ${HypixelColors.DARK_AQUA}">${NWL(api.networkExp)}</span><br><br>
                ${starColor(api.stats.Duels.wins)}<br>
                Winstreak: <span style="color: ${ws.color}">${ws.count}</span><br><br>
                Kills: <span style="color: ${HypixelColors.GREEN}">${api.stats.Duels.kills}</span><br>
                Deaths: <span style="color: ${HypixelColors.RED}">${api.stats.Duels.deaths}</span><br>
                KDR: <span style="color: ${HypixelColors.GOLD}">${parseFloat(api.stats.Duels.kills/api.stats.Duels.deaths).toFixed(3)}</span><br><br>
                Wins: <span style="color: ${HypixelColors.GREEN}">${api.stats.Duels.wins}</span><br>
                Losses: <span style="color: ${HypixelColors.RED}">${api.stats.Duels.losses}</span><br>
                WLR: <span style="color: ${HypixelColors.GOLD}">${parseFloat(api.stats.Duels.wins/api.stats.Duels.losses).toFixed(3)}</span>
            </p>
        `;} catch {return '<p style="color: red">ERROR LOADING STATS</p>'}
    },

    getTemplateHTML: function(api, gamemode, BWmode) {
        return `
            <p style="font-size: 24px; margin: 0;">${nameColor(api)}</p>
            ${(gamemode === 0 ? this.getBedwarsHTML(api, BWmode) : (gamemode === 1 ? this.getSkywarsHTML(api) : this.getDuelsHTML(api)))}
        `;
    },

    reset: function() {
        $(_class).remove();
        this.shownPlayer = null;
    },

    show: function($elem, player, gamemode, BWmode) {
        if (!player || !player.api) return;
        if (player.name === this.shownPlayer) return;
        $(_class).remove();
        $parent.append(`<div class="popup_stats">${this.getTemplateHTML(player.api, gamemode, BWmode)}</div>`);
        this.shownPlayer = player.name;
    }
}

module.exports = { PopupStats }