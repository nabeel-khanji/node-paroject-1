/**
 * States.js
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
            where: {country: parseInt(params.id)}
        };
        
        if (params.searchValue) {

            match.where.or = States.columnsToSearch(params.searchValue);
        }

        let total = await States.count(match)

        let states = await States.find(match).limit(params.limit).skip(params.offset);

        return Promise.all(states).then((data) => {

            return {
                data: data,
                pagination: customServices.pagination_detail(total, params.page, params.limit)
            };
        });
    },

    columnsToSearch: (searchValue) => {

        return [
            {name: {'contains': searchValue}},
            {_id: searchValue},
        ];
    },

};

