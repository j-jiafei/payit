import webapp2
import jinja2
import os
import json
from google.appengine.ext import db

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


class Seller(db.Model):
  email = db.EmailProperty()
  name = db.StringProperty()
  address = db.PostalAddressProperty()


class SellerPayment(db.Model):
  """ Parent: Seller """
  payment = db.StringProperty()
  app_key = db.StringProperty()
  app_secret = db.StringProperty()


class Buyer(db.Model):
  email = db.EmailProperty()


class BuyerPayment(db.Model):
  """ Parent: Buyer """
  payment = db.StringProperty()
  app_key = db.StringProperty()
  app_secret = db.StringProperty()


class Product(db.Model):
  """ Parent: Seller """
  price = db.FloatProperty()
  seller_id = db.IntegerProperty()


class Transaction(db.Model):
  """ Parent: Product """
  buyer_id = db.IntegerProperty()
  seller_geo = db.GeoPtProperty()
  buyer_geo = db.GeoPtProperty()
  product_id = db.IntegerProperty()
  price = db.FloatProperty()


class ProductPullRequestDummyHandler(webapp2.RequestHandler):
  """ Dummy request handler for demo or debugging use """
  def get(self):
    output = {}
    seller = {
        'merchantName': 'Demo Bookstore',
        'email': 'demo@bookstore.com',
        'sid': 123 }
    output['seller'] = seller
    product_list = []
    product0 = { 'name': 'book1', 'itemID': 0, 'totalPrice': 43.0, 'itemPrice': 43.0 , 'itemCount': 1 }
    product1 = { 'name': 'book2', 'itemID': 1, 'totalPrice': 63.5, 'itemPrice': 63.5 , 'itemCount': 1 }
    product2 = { 'name': 'book3', 'itemID': 2, 'totalPrice': 23.0, 'itemPrice': 23.0 , 'itemCount': 1 }
    product_list.append(product0)
    product_list.append(product1)
    product_list.append(product2)
    output['product_list'] = product_list
    self.response.write(json.dumps(output))


class ProductPullRequestHandler(webapp2.RequestHandler):
  """ Buyers pull details of products """
  def get(self):
    """ Sample
        See dummy request handler
    """
    self.response.write("Hello, Payit!")


class NewProductRequestHandler(webapp2.RequestHandler):
  """ Sellers create a new product """
  def get(self):
    """ Sample

        params: ?s-email='joe@gmail.com'&pid=1&name='book1'&price=12.0
    """
    pass


class UpdateProductRequestHandler(webapp2.RequestHandler):
  """ Sellers update an existing product """
  def get(self):
    pass


class DeleteProductRequestHandler(webapp2.RequestHandler):
  """ Sellers delete an existing product """
  def get(self):
    pass


class SyncProductRequesthandler(webapp2.RequestHandler):
  """ Sellers sync all the products with the server """
  def get(self):
    pass


application = webapp2.WSGIApplication([
  ('/pull-products', ProductPullRequestDummyHandler),
  ('/new-product', NewProductRequestHandler),
  ('/update-product', UpdateProductRequestHandler),
  ('/delete-product', DeleteProductRequestHandler),
  ('/sync-products', SyncProductRequesthandler),
], debug=True)
