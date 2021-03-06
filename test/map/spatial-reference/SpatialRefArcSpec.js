describe('#SpatialReference.Arc', function () {
    var expected = { 'spatialReference':{ 'resolutions':[132.291931250529, 52.9167725002117, 26.4583862501058, 13.2291931250529, 5.29167725002117, 2.64583862501058, 1.32291931250529, 0.529167725002117, 0.264583862501058, 0.132291931250529], 'fullExtent':{ 'xmin':-72625.16349000037, 'ymin':-82574.4862099995, 'xmax':75957.00628999919, 'ymax':86066.27641000012 }}, 'tileSystem':[1, -1, -66000, 75000], 'tileSize':{ 'width':512, 'height':512 }};

    var arcgis = {
        'serviceDescription': '',
        'mapName': 'Layers',
        'description': '',
        'copyrightText': '',
        'layers': [
            {
                'id': 0,
                'name': 'range',
                'parentLayerId': -1,
                'defaultVisibility': true,
                'subLayerIds': null
            }
        ],
        'spatialReference': {
            'wkt': 'PROJCS["shanghaicity",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",-3457147.81],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",121.2751921],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
        },
        'singleFusedMapCache': true,
        'tileInfo': {
            'rows': 512,
            'cols': 512,
            'dpi': 96,
            'format': 'PNG24',
            'compressionQuality': 0,
            'origin': {
                'x': -66000,
                'y': 75000
            },
            'spatialReference': {
                'wkt': 'PROJCS["shanghaicity",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",-3457147.81],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",121.2751921],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
            },
            'lods': [
                {
                    'level': 0,
                    'resolution': 132.291931250529,
                    'scale': 500000
                },
                {
                    'level': 1,
                    'resolution': 52.9167725002117,
                    'scale': 200000
                },
                {
                    'level': 2,
                    'resolution': 26.4583862501058,
                    'scale': 100000
                },
                {
                    'level': 3,
                    'resolution': 13.2291931250529,
                    'scale': 50000
                },
                {
                    'level': 4,
                    'resolution': 5.29167725002117,
                    'scale': 20000
                },
                {
                    'level': 5,
                    'resolution': 2.64583862501058,
                    'scale': 10000
                },
                {
                    'level': 6,
                    'resolution': 1.32291931250529,
                    'scale': 5000
                },
                {
                    'level': 7,
                    'resolution': 0.529167725002117,
                    'scale': 2000
                },
                {
                    'level': 8,
                    'resolution': 0.264583862501058,
                    'scale': 1000
                },
                {
                    'level': 9,
                    'resolution': 0.132291931250529,
                    'scale': 500
                }
            ]
        },
        'initialExtent': {
            'xmin': -124551.50148183308,
            'ymin': -100208.16705048522,
            'xmax': 140884.14736496765,
            'ymax': 103275.70796679654,
            'spatialReference': {
                'wkt': 'PROJCS["shanghaicity",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",-3457147.81],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",121.2751921],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
            }
        },
        'fullExtent': {
            'xmin': -72625.16349000037,
            'ymin': -82574.4862099995,
            'xmax': 75957.00628999919,
            'ymax': 86066.27641000012,
            'spatialReference': {
                'wkt': 'PROJCS["shanghaicity",GEOGCS["GCS_Beijing_1954",DATUM["D_Beijing_1954",SPHEROID["Krasovsky_1940",6378245.0,298.3]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",-3457147.81],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",121.2751921],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
            }
        },
        'units': 'esriMeters',
        'supportedImageFormatTypes': 'PNG24,PNG,JPG,DIB,TIFF,EMF,PS,PDF,GIF,SVG,SVGZ,AI',
        'documentInfo': {
            'Title': 'rang',
            'Author': 'wzf',
            'Comments': '',
            'Subject': '',
            'Category': '',
            'Keywords': ''
        }
    };

    it('load from url', function (done) {
        maptalks.SpatialReference.loadArcgis('/resources/arcgis.json', function (err, conf) {
            expect(err).to.be(null);
            expect(conf).to.be.eql(expected);
            done();
        });
    });

    it('load from json', function (done) {
        maptalks.SpatialReference.loadArcgis(arcgis, function (err, conf) {
            expect(err).to.be(null);
            expect(conf).to.be.eql(expected);
            done();
        });
    });

    it('load from string', function (done) {
        maptalks.SpatialReference.loadArcgis(JSON.stringify(arcgis), function (err, conf) {
            expect(err).to.be(null);
            expect(conf).to.be.eql(expected);
            done();
        });
    });
});
