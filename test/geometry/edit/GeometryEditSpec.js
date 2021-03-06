
describe('#GeometryEdit', function () {
    var container, eventContainer;
    var map;
    var center = new maptalks.Coordinate(118.846825, 32.046534);
    var layer;
    function dragGeometry(geometry, offset) {
        var domPosition = GET_PAGE_POSITION(container);
        var point = map.coordinateToContainerPoint(geometry.getCenter()).add(domPosition);
        if (offset) {
            point._add(offset);
        }
        happen.mousedown(eventContainer, {
            'clientX':point.x,
            'clientY':point.y
        });
        for (var i = 0; i < 10; i++) {
            happen.mousemove(document, {
                'clientX':point.x + i,
                'clientY':point.y + i
            });
        }
        happen.mouseup(document);
    }

    beforeEach(function () {
        var setups = COMMON_CREATE_MAP(center, null);
        container = setups.container;
        map = setups.map;
        map.config('panAnimation', false);
        eventContainer = map._panels.canvasContainer;
        layer = new maptalks.VectorLayer('id');
        map.addLayer(layer);
    });

    afterEach(function () {
        map.remove();
        REMOVE_CONTAINER(container);
    });

    describe('edit all kinds of geometries', function () {
        it('can only be edited on a map', function () {
            var marker = new maptalks.Marker(map.getCenter());
            marker.startEdit();
            expect(marker.isEditing()).not.to.be.ok();
        });

        describe('drag all kinds of geometries', function () {
            var geometries = GEN_GEOMETRIES_OF_ALL_TYPES();
            function testDrag(geo) {
                return function () {
                    if (geo instanceof maptalks.GeometryCollection || geo instanceof maptalks.Sector) {
                        //not fit for geometry collection's test.
                        return;
                    }
                    layer.addGeometry(geo);
                    geo.startEdit();
                    var center = geo.getCenter();
                    dragGeometry(geo);
                    expect(geo.getCenter()).not.to.closeTo(center);
                    //geo can only be dragged by center handle.
                    var newCenter = geo.getCenter();
                    dragGeometry(geo, new maptalks.Point(500, 20));
                    expect(geo.getCenter()).to.closeTo(newCenter);
                    geo.endEdit();
                };
            }
            for (var i = 0; i < geometries.length; i++) {
                it('drag geometry ' + geometries[i].getType(), testDrag(geometries[i]));
            }
        });
    });

    describe('edit a geometry', function () {
        it('not all markers can be edited', function () {
            for (var i = 0; i < COMMON_SYMBOL_TESTOR.markerSymbols.length; i++) {
                var symbol = COMMON_SYMBOL_TESTOR.markerSymbols[i];
                var marker = new maptalks.Marker(center, { symbol:symbol });
                marker.addTo(layer);
                marker.startEdit();
                if (symbol['text-name']) {
                    //text markers can't be edited.
                    expect(marker.isEditing()).not.to.be.ok();
                } else {
                    //image marker and vector marker can be edited.
                    expect(marker.isEditing()).to.be.ok();
                }
                marker.endEdit();
                expect(marker.isEditing()).not.to.be.ok();
            }
            var label = new maptalks.Label('label', center);
            label.startEdit();
            //label can't be edited.
            expect(label.isEditing()).not.to.be.ok();
            label.endEdit();
        });

        it('resize a vector marker', function () {
            var marker = new maptalks.Marker(map.getCenter(), {
                symbol : {
                    markerType:'ellipse',
                    markerWidth:20,
                    markerHeight:20
                }
            }).addTo(layer);
            var size = marker.getSize();
            marker.startEdit();
            dragGeometry(marker, new maptalks.Point(size.width / 2, 0));
            var symbol = marker.getSymbol();
            expect(symbol.markerWidth).to.be.approx(39);
            expect(symbol.markerHeight).to.be.approx(20);
            marker.endEdit();
        });

        it('resize a vector marker with fix aspect ratio', function () {
            var marker = new maptalks.Marker(map.getCenter(), {
                symbol : {
                    markerType:'ellipse',
                    markerWidth:20,
                    markerHeight:20
                }
            }).addTo(layer);
            marker.startEdit({ 'fixAspectRatio' : true });
            var size = marker.getSize();
            dragGeometry(marker, new maptalks.Point(size.width / 2, 0));
            var symbol = marker.getSymbol();
            expect(symbol.markerWidth).to.be.approx(39);
            expect(symbol.markerHeight).to.be.approx(39);
            marker.endEdit();
        });

        it('resize a circle', function () {
            var circle = new maptalks.Circle(map.getCenter(), 1000).addTo(layer);
            circle.startEdit();
            var size = circle.getSize();
            dragGeometry(circle, new maptalks.Point(size.width / 2, 0));
            var r = circle.getRadius();
            expect(r).to.be.eql(1010.22151);
            circle.endEdit();
        });

        it('resize a ellipse', function () {
            var ellipse = new maptalks.Ellipse(map.getCenter(), 1000, 500).addTo(layer);
            ellipse.startEdit();
            var size = ellipse.getSize();
            dragGeometry(ellipse, new maptalks.Point(size.width / 2, size.height / 2));
            expect(ellipse.getWidth()).to.be.approx(1020.27122);
            expect(ellipse.getHeight()).to.be.approx(520.2339);
            ellipse.endEdit();
        });

        it('resize a ellipse with fix aspect ratio', function () {
            var ellipse = new maptalks.Ellipse(map.getCenter(), 100, 50).addTo(layer);
            ellipse.startEdit({ 'fixAspectRatio' : true });
            var size = ellipse.getSize();
            var ratio = ellipse.getWidth() / ellipse.getHeight();
            dragGeometry(ellipse, new maptalks.Point(size.width / 2, 0));
            expect(ellipse.getWidth()).to.be.approx(120.24692);
            expect(ellipse.getHeight()).to.be.approx(120.24692 / ratio);
            ellipse.endEdit();
        });

        it('resize a rectangle', function () {
            var rect = new maptalks.Rectangle(map.getCenter(), 1000, 500).addTo(layer);
            rect.startEdit();
            var size = rect.getSize();
            dragGeometry(rect, new maptalks.Point(size.width / 2, size.height / 2));
            expect(rect.getWidth()).to.be.approx(1011.0866);
            expect(rect.getHeight()).to.be.approx(511.11058);
            rect.endEdit();
        });

        it('resize a rectangle with fix aspect ratio', function () {
            var rect = new maptalks.Rectangle(map.getCenter(), 100, 50).addTo(layer);
            rect.startEdit({ 'fixAspectRatio' : true });
            var size = rect.getSize();
            var ratio = rect.getWidth() / rect.getHeight();
            dragGeometry(rect, new maptalks.Point(size.width / 2, 0));
            expect(rect.getWidth()).to.be.approx(111.13518);
            expect(rect.getHeight()).to.be.approx(111.13518 / ratio);
            rect.endEdit();
        });

        it('change a polygon vertex', function () {
            var rect = new maptalks.Rectangle(map.getCenter(), 1000, 500).addTo(layer);
            var polygon = new maptalks.Polygon(rect.getShell()).addTo(layer);
            var o = polygon.toGeoJSON();
            polygon.startEdit();
            var size = polygon.getSize();
            dragGeometry(polygon, new maptalks.Point(size.width / 2, size.height / 2));
            expect(polygon.toGeoJSON()).not.to.be.eqlGeoJSON(o);
            var expected = { 'type':'Feature', 'geometry':{ 'type':'Polygon', 'coordinates':[[[118.84682500000001, 32.046534], [118.85742312186674, 32.046534], [118.85751916135895, 32.041960573990714], [118.84682500000001, 32.04204242358055], [118.84682500000001, 32.046534]]] }, 'properties':null };
            expect(polygon.toGeoJSON()).to.be.eqlGeoJSON(expected);
            polygon.endEdit();
        });

        it('update symbol when editing', function (done) {
            var circle = new maptalks.Circle(map.getCenter(), 1000, {
                symbol : {
                    'polygonFill' : '#f00'
                }
            }).addTo(layer);
            circle.startEdit();
            var editStage = circle._editor._editStageLayer;
            editStage.once('layerload', function () {
                expect(editStage).to.be.painted(0, 20, [255, 0, 0]);
                editStage.once('layerload', function () {
                    expect(editStage).to.be.painted(0, 20, [255, 255, 0]);
                    circle.endEdit();
                    done();
                });
                circle.updateSymbol({
                    'polygonFill' : '#ff0'
                });
            });
        });
    });


});
