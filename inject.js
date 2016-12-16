$(document).bind('DOMNodeInserted', function(e) {
	var $el = $(e.target);
	var $button = $el.find('[name=btnAddFBA]');
	if ($button.length > 0) {
		var $container = $button.parent().parent().parent();
		var url = $container.find('a[name=lnkTitle]').attr('href') || '';
		var matches = url.match(/.*\/(.*)$/);
		if (matches.length > 0) {
			var uuid = matches[1];
			$button.on('click', function(event) {
				window.open('https://amazon.com/gp/offer-listing/' + uuid);
			});
		}		
	}	
	var $assigned_forms = $el.find('form.assigned-form');
	var set_focus = false;
	if ($assigned_forms.length) {
		set_focus = true;
	}
	var $unassigned_forms = $el.find('form.unassigned-form');
	if ($unassigned_forms.length) {
		set_focus = true;
		$.ajax('https://app.inventorylab.com/api/List/InitList', {
			error: function(req, status, err) {
				console.warn("ERROR FETCHING LIST:", status, err);
			},
			success: function(data, status, req) {
				console.warn("DATA:", data);
				if (data && data.Result && data.Result.workingShipment) {
					var shipments = {};
					(data.Result.workingShipment || []).map(function(shipment) {
						shipments[shipment.ShipmentId] = shipment;
					});
					var products = {};
					(
						data.Result.productSummary && data.Result.productSummary.productList ? 
							data.Result.productSummary.productList : []
					).map(function(product) {
						products[product.MSKU] = product;
					});
					$unassigned_forms.each(function(index, form) {
						var $form = $(form);
						var boxCounter = $form.closest('.item-counter');
						var ShipmentId = boxCounter.attr('data-shipmentid');
						var shipment = shipments[ShipmentId];
						if (!shipment) { console.warn("NO SHIPMENT", ShipmentId, shipments); return; }
						var $container = $form.closest('.item-info-container');
						var infos = $container.find('.item-info-label_value');
						console.warn("INFOS:", infos);
						if (!infos || infos.length < 2) { console.warn("NO INFOS:", infos); return; }
						var mskuInfo = infos[1];
						console.warn(mskuInfo);
						var msku = mskuInfo.innerHTML;
						console.warn("MSKU:", msku);
						var product = products[msku];
						if (!product) { console.warn("NO PRODUCT:", msku, products); return; }
						var boxes = shipment.Boxes;
						if (!boxes || boxes.length == 0) { return; }
						var latestBox = boxes[0];
						var boxInput = boxCounter.find('input.box-name');
			//      var boxId = boxInput.attr('data-boxid');
						var originalBoxId = $form.attr('data-originalboxid');
			//      var boxName = boxInput.val().trim();
						var qtyInput = boxCounter.find('input.quantity');
						var qty = qtyInput.val() == '' ? 0 : parseInt(qtyInput.val());
						var payload = {
							BatchId: shipment.BatchId,
							BoxId: latestBox.BoxId,
							BoxName: latestBox.BoxName,
							Destination: shipment.Destination,
							ExpireDate: null,
							MSKU: msku,
							OriginalBoxId: originalBoxId,
							ProductId: product.ProductId,
							Qty: qty,
							shipmentId: ShipmentId
						};
						console.warn("PAYLOAD", payload);
						$.ajax('https://app.inventorylab.com/api/BoxLevel/AssignBox', {
							method: 'POST',
							dataType: 'json',
							data: payload,
							error: function(ereq, estatus, err) {
								console.warn("ERROR ASSIGNING BOX:", estatus, err);
							},
							success: function(result) {
								console.warn("RESULT:", result);
							}
						});
					});
				}
			}
		});
		console.warn("UNASSIGNED:", $unassigned_forms.length);
		set_focus = true;
	}
	if (set_focus) {
		var inputs = $('input[name=txtProduct]');
	}
});
