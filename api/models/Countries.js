/**
 * Countries.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    },

    findAll: async (params) => {

        let match = {
            where: {sortname: "US"}
        };

        if (params.searchValue) {

            match.where.or = Countries.columnsToSearch(params.searchValue);
        }

        let total = await Countries.count(match)

        let countries = await Countries.find(match).limit(params.limit).skip(params.offset);

        return Promise.all(countries).then((data) => {

            return {
                data: data,
                pagination: customServices.pagination_detail(total, params.page, params.limit)
            };
        });
    },

    columnsToSearch: (searchValue) => {

        return [
            {name: {'contains': searchValue}},
            {sortname: {'contains': searchValue}},
            {_id: searchValue},
        ];
    },

};

