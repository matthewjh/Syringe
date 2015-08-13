function run() {
	var oneToken = new syringe.Token(),
		twoToken = new syringe.Token(),
		threeToken = new syringe.Token(),
		fourToken = new syringe.Token();

	var bind = syringe.bind;
	var injector = new syringe.Injector([
		bind(oneToken).toValue(1),
		bind(twoToken).toFactory(function (one) { return one + one; },
			oneToken),
		bind(threeToken).toFactory(function (two, one) { return two + one; },
			twoToken, oneToken),
		bind(fourToken).toAsyncFactory(function (three) { return Promise.resolve(three + 1); },
			threeToken)
	]);

	var start = performance.now();

	for (var i = 0; i < 10000000; i++) {
		injector.get(fourToken);
		injector.get(threeToken);
		injector.get(twoToken);
		injector.get(oneToken);
	}

	var end = performance.now();

	console.log('time = ', end - start);
}