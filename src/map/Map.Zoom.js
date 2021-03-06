import { isNil } from 'core/util';
import Browser from 'core/Browser';
import { Animation } from 'core/Animation';
import Point from 'geo/Point';
import Map from './Map';
import TileLayer from 'layer/tile/TileLayer';

Map.include(/** @lends Map.prototype */{

    _zoom(nextZoom, origin) {
        if (!this.options['zoomable'] || this.isZooming()) { return; }
        origin = this._checkZoomOrigin(origin);
        nextZoom = this._checkZoom(nextZoom);
        this.onZoomStart(nextZoom, origin);
        this._frameZoom = this.getZoom();
        this.onZoomEnd(nextZoom, origin);
    },

    _zoomAnimation(nextZoom, origin, startScale) {
        if (!this.options['zoomable'] || this.isZooming()) { return; }

        nextZoom = this._checkZoom(nextZoom);
        if (this.getZoom() === nextZoom) {
            return;
        }
        origin = this._checkZoomOrigin(origin);
        this.onZoomStart(nextZoom, origin);
        this._startZoomAnimation(nextZoom, origin, startScale);
    },

    _checkZoomOrigin(origin) {
        if (!origin || this.options['zoomInCenter'] || (this.getPitch() && (this.getBaseLayer() instanceof TileLayer))) {
            origin = new Point(this.width / 2, this.height / 2);
        }
        return origin;
    },

    _startZoomAnimation(nextZoom, origin, startScale) {
        if (isNil(startScale)) {
            startScale = 1;
        }
        const endScale = this._getResolution(this._startZoomVal) / this._getResolution(nextZoom);
        const duration = this.options['zoomAnimationDuration'] * Math.abs(endScale - startScale) / Math.abs(endScale - 1);
        this._frameZoom = this._startZoomVal;
        const player = Animation.animate(
            {
                'zoom'  : [this._startZoomVal, nextZoom]
            },
            {
                'easing' : 'out',
                'duration'  : duration
            },
            frame => {
                if (this.isRemoved()) {
                    player.finish();
                    return;
                }
                if (frame.state.playState === 'finished') {
                    this.onZoomEnd(frame.styles['zoom'], origin);
                } else {
                    this.onZooming(frame.styles['zoom'], origin, startScale);
                }
            }
        ).play();
    },

    onZoomStart(nextZoom, origin) {
        this._zooming = true;
        this._enablePanAnimation = false;
        this._startZoomVal = this.getZoom();
        this._startZoomCoord = this.containerPointToCoordinate(origin);
        /**
          * zoomstart event
          * @event Map#zoomstart
          * @type {Object}
          * @property {String} type                    - zoomstart
          * @property {Map} target                     - the map fires event
          * @property {Number} from                    - zoom level zooming from
          * @property {Number} to                      - zoom level zooming to
          */
        this._fireEvent('zoomstart', { 'from' : this._startZoomVal, 'to': nextZoom });
    },

    onZooming(nextZoom, origin, startScale) {
        const frameZoom = this._frameZoom;
        if (frameZoom === nextZoom) {
            return;
        }
        if (isNil(startScale)) {
            startScale = 1;
        }
        this._zoomTo(nextZoom, origin);
        const res = this.getResolution(nextZoom);
        const fromRes = this.getResolution(this._startZoomVal);
        const scale = fromRes / res / startScale;
        const offset = this.offsetPlatform();
        const matrix = {
            'view' : [scale, 0, 0, scale, (origin.x - offset.x) *  (1 - scale), (origin.y - offset.y) *  (1 - scale)]
        };
        if (Browser.retina) {
            origin = origin.multi(2);
        }
        matrix['container'] = [scale, 0, 0, scale, origin.x * (1 - scale), origin.y *  (1 - scale)];
        /**
          * zooming event
          * @event Map#zooming
          * @type {Object}
          * @property {String} type                    - zooming
          * @property {Map} target                     - the map fires event
          * @property {Number} from                    - zoom level zooming from
          * @property {Number} to                      - zoom level zooming to
          */
        this._fireEvent('zooming', { 'from' : this._startZoomVal, 'to': nextZoom, 'origin' : origin, 'matrix' : matrix });
        this._frameZoom = nextZoom;
        this._getRenderer().render();
    },

    onZoomEnd(nextZoom, origin) {
        const startZoomVal = this._startZoomVal;
        this._zoomTo(nextZoom, origin);
        this._zooming = false;
        this._getRenderer().onZoomEnd();

        /**
          * zoomend event
          * @event Map#zoomend
          * @type {Object}
          * @property {String} type                    - zoomend
          * @property {Map} target                     - the map fires event
          * @property {Number} from                    - zoom level zooming from
          * @property {Number} to                      - zoom level zooming to
          */
        this._fireEvent('zoomend', { 'from' : startZoomVal, 'to': nextZoom });
    },

    _zoomTo(nextZoom, origin) {
        this._zoomLevel = nextZoom;
        this._calcMatrices();
        if (origin) {
            this.setCoordinateAtContainerPoint(this._startZoomCoord, origin);
        }
    },

    _checkZoom(nextZoom) {
        const maxZoom = this.getMaxZoom(),
            minZoom = this.getMinZoom();
        if (nextZoom < minZoom) {
            nextZoom = minZoom;
        }
        if (nextZoom > maxZoom) {
            nextZoom = maxZoom;
        }
        return nextZoom;
    }
});
