# -*- coding: utf-8 -*-
# from odoo import http


# class DynamicSearch(http.Controller):
#     @http.route('/dynamic_search/dynamic_search', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/dynamic_search/dynamic_search/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('dynamic_search.listing', {
#             'root': '/dynamic_search/dynamic_search',
#             'objects': http.request.env['dynamic_search.dynamic_search'].search([]),
#         })

#     @http.route('/dynamic_search/dynamic_search/objects/<model("dynamic_search.dynamic_search"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('dynamic_search.object', {
#             'object': obj
#         })

