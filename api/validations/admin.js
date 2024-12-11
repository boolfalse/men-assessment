
const helper = require('../utils/helpers');
const staticData = require('../config/static-data');

module.exports = {
    getUsers: (data) => {
        const filteredData = {};

        // Validate "term" parameter
        if (data.term) {
            if (data.term.length > 0 && data.term.length <= 20) {
                filteredData.term = data.term;
            } else {
                return {
                    errMessage: 'Term must have 1 to 20 characters!',
                };
            }
        }

        // Validate "page" parameter
        let page = 1;
        if (data.page) {
            if (helper.is_natural(data.page)) {
                page = Number(data.page) > 0 ? Number(data.page) : 1;
            }
        }
        filteredData.page = page;

        // Validate "per" parameter
        let per = staticData.pagination.per_default;
        if (data.per) {
            if (helper.is_natural(data.per)) {
                per = Number(data.per) > 0 ? Number(data.per) : staticData.pagination.per_default;
            }
        }
        filteredData.per = per > staticData.pagination.per_max ? staticData.pagination.per_default : per;

        return {
            filteredData,
        };
    },
};