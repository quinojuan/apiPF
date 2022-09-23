/**
 * Esta funcion lo que hace es relacionarme los precios con la capacidad de cada producto
 * @params array_Products
 * @return newArray_Products
 */
const relacionarPreciosCapacidad = (arrProductos) => {
	let posicionRepetidos = [];
	arrProductos.forEach((product, index) => {
		if (product.price.length > 1) posicionRepetidos.push(index);
	});
	posicionRepetidos.reverse().forEach((pos) => {
		//recorro al revés las posiciones de manera que si voy a borrar un producto,que lo haga desde el final al inicio asi no me modifica los valores.
		//Funcion de empujar los nuevos productos al array,leyendo la posición

		//console.log(arrProductos[pos]);

		arrProductos[pos].price.forEach((ePrice, index) => {
			let newProduct = { ...arrProductos[pos] };
			//console.log(index, ePrice, newProduct);
			newProduct['price'] = [ePrice];
			newProduct['capacity'] = [newProduct.capacity[index]];
			// console.log(newProduct);
			arrProductos.push(newProduct);
		});

		arrProductos.splice(pos, 1);
	});
	return arrProductos;
};

module.exports = { relacionarPreciosCapacidad };
