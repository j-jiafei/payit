import webapp2
import jinja2
import os
import json
from google.appengine.ext import db
from gaesessions import get_current_session


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


# FIME - Store hashed password
class Seller(db.Model):
  email = db.EmailProperty()
  name = db.StringProperty()
  password = db.StringProperty()
  address = db.PostalAddressProperty()


class SellerPayment(db.Model):
  """ Parent: Seller """
  payment = db.StringProperty()
  app_key = db.StringProperty()
  app_secret = db.StringProperty()


# FIME - Store hashed password
class Buyer(db.Model):
  email = db.EmailProperty()
  password = db.StringProperty()


class BuyerPayment(db.Model):
  """ Parent: Buyer """
  payment = db.StringProperty()
  app_key = db.StringProperty()
  app_secret = db.StringProperty()


class Product(db.Model):
  """ Parent: Seller
      pid is the seller local id for each product
  """
  pid = db.IntegerProperty()
  name = db.StringProperty()
  price = db.FloatProperty()


class Transaction(db.Model):
  """ Parent: Product """
  buyer_id = db.IntegerProperty()
  price = db.FloatProperty()
  seller_geo = db.GeoPtProperty()
  buyer_geo = db.GeoPtProperty()


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
#    product0 = { 'name': 'book1', 'itemID': 0, 'totalPrice': 43.0, 'itemPrice': 43.0 , 'itemCount': 1 }
#    product1 = { 'name': 'book2', 'itemID': 1, 'totalPrice': 63.5, 'itemPrice': 63.5 , 'itemCount': 1 }
#    product2 = { 'name': 'book3', 'itemID': 2, 'totalPrice': 23.0, 'itemPrice': 23.0 , 'itemCount': 1 }
    product0 = { 'name': 'Founders at work', 'itemID': 4, 'totalPrice': 54.25, 'itemPrice': 50.0 , 'itemCount': 1 }
    product_list.append(product0)
#    product_list.append(product1)
#    product_list.append(product2)
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

        params: ?semail=joe@gmail.com&pid=1&name=book1&price=12.0
    """
    seller_email = self.request.get('semail')
    product_id = int(self.request.get('pid'))
    product_name = self.request.get('name')
    price = float(self.request.get('price'))
# find seller first to be the parent of the product
    seller = Seller.all().filter('email = ', seller_email).get()
    if seller is None:
      self.response.write('Bad seller email address')
      return
    product = Product(parent=seller, name=product_name, pid=product_id,
      price=price)
    product.put()


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


class NewSellerRequestHandler(webapp2.RequestHandler):
  """ Sample

      params: ?email='jeff@gmail.com'&name='Demo bookstore'&address='4444 1st Ave, Bellevue, WA 92039'
  """
  def get(self):
    email = self.request.get('email')
    name = self.request.get('name')
    address = self.request.get('address')
    seller = Seller(email=email, name=name, address=address)
    seller.put()


class NewBuyerRequestHandler(webapp2.RequestHandler):
  """ Sample

      params: ?email='joe@gmail.com'
  """
  def get(self):
    email = self.request.get('email')
    buyer = Buyer(email=email)
    buyer.put()
    pass


class NewTransactionRequestHandler(webapp2.RequestHandler):
  """ Sample

      params: ?bemail='12345'&semail='jeff@gmail.com'&pid='23455'&price=34.0&sgeo=''&bgeo=''
  """
  def get(self):
    buyer_email = self.request.get('bemail')
    seller_email = self.request.get('semail')
    product_id = int(self.request.get('pid'))
    price = float(self.request.get('price'))
    seller = Seller.all().filter('email = ', seller_email).get()
    if seller is None:
      self.response.write('seller is None: ' + seller_email)
      self.response.write('fail')
      return
    buyer = Buyer.all().filter('email = ', buyer_email).get()
    if buyer is None:
      self.response.write('buyer is None: ' + buyer_email)
      self.response.write('fail')
      return
    product = Product.all().filter('pid = ', product_id).ancestor(seller.key()).get()
    if product is None:
      self.response.write('Product is None: ' + product_id)
      return
    transaction = Transaction(parent=product, buyer_id=buyer.key().id(), price=price)
    transaction.put()
    self.response.write('success')


class ListTransactionRequestHandler(webapp2.RequestHandler):
  def get(self):
    session = get_current_session()
    sid = session.get('sid')
    if sid is None:
      self.redirect('/')
    seller = Seller.get_by_id(sid)
    if seller is None:
      session['sid'] = None
      self.redirect('/')
    template_values = {
      'name': seller.name
    }
    template = JINJA_ENVIRONMENT.get_template('transaction_list.html')
    self.response.write(template.render(template_values))


class IndexPageHandler(webapp2.RequestHandler):
  def get(self):
    session = get_current_session()
    sid = session.get('sid')
    if sid is not None:
      self.redirect('/list-transactions')
      return
    template_values = {
    }
    template = JINJA_ENVIRONMENT.get_template('index.html')
    self.response.write(template.render(template_values))


class SignInRequestHandler(webapp2.RequestHandler):
  def post(self):
    email = self.request.get('email')
    password = self.request.get('password')
    user_group = self.request.get('user_group')
    remember_me = self.request.get('remember-me')
    session = get_current_session()
    session.regenerate_id()
    if user_group == 'seller':
      seller = Seller.all().filter('email = ', email).get()
      if seller is not None and seller.password == password:
        uid = seller.key().id()
        if remember_me:
          session['sid'] = seller.key().id()
        else:
          session.set_quick('sid', seller.key().id())
        self.redirect("/list-transactions")
    elif user_group == 'buyer':
      buyer = Buyer.all().filter('email = ', email).get()
      print buyer.password
      print password
      if buyer is not None and buyer.password == password:
        uid = buyer.key().id()
        if remember_me:
          session['bid'] = buyer.key().id()
        else:
          session.set_quick('bid', buyer.key().id())
    self.redirect("/")


class SignOutRequestHandler(webapp2.RequestHandler):
  def get(self):
    session = get_current_session()
    session['sid'] = None
    self.redirect('/')


class RegisterRequestHandler(webapp2.RequestHandler):
  def get(self):
    template_values = {
    }
    template = JINJA_ENVIRONMENT.get_template('register.html')
    self.response.write(template.render(template_values))


class NewUserRequestHandler(webapp2.RequestHandler):
  def post(self):
    email = self.request.get('email')
    name = self.request.get('name')
    password = self.request.get('password')
    user_group = self.request.get('user_group')
    if user_group == 'seller':
      if Seller.all().filter('email = ', email).get() is not None:
        self.redirect('/register')
        return
      seller = Seller(email=email, name=name, password=password)
      seller.put()
    elif user_group == 'buyer':
      if Buyer.all().filter('email = ', email).get() is not None:
        self.redirect('/register')
        return
      buyer = Buyer(email=email, password=password)
      buyer.put()
    self.redirect('/')


application = webapp2.WSGIApplication([
  ('/new-user', NewUserRequestHandler),
  ('/new-seller', NewSellerRequestHandler),
  ('/new-buyer', NewBuyerRequestHandler),
  ('/pull-products', ProductPullRequestDummyHandler),
  ('/new-product', NewProductRequestHandler),
  ('/update-product', UpdateProductRequestHandler),
  ('/delete-product', DeleteProductRequestHandler),
  ('/sync-products', SyncProductRequesthandler),
  ('/new-transaction', NewTransactionRequestHandler),
  ('/list-transactions', ListTransactionRequestHandler),
  ('/signin', SignInRequestHandler),
  ('/signout', SignOutRequestHandler),
  ('/register', RegisterRequestHandler),
  ('/', IndexPageHandler),
], debug=True)
