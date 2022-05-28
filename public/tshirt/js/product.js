window.onload = function () {

  function panierProductSchema() {
    return {
      product_id: '',
      product_size: 'medium',
      quantite: 1
    }
  }

  var panier = {
    list: []
  };

  //////////////////////////////////////////////////////////
  $('#product-form').submit(function(e){
    e.preventDefault();
    addToBasket(e.target);
  })

}

function addToBasket(form){
  console.log(form.elements);
}