import * as m from "three";
import { Controls as Ot, Vector3 as G, MOUSE as ce, TOUCH as re, Quaternion as Te, Spherical as Ve, Vector2 as I, Ray as Gt, Plane as qt, MathUtils as mt, Scene as Nt, BoxGeometry as gt, MeshStandardMaterial as ye, BackSide as Kt, PointLight as xt, Mesh as ee, InstancedMesh as Et, Object3D as ze, MeshLambertMaterial as zt, BufferGeometry as wt, TrianglesDrawMode as Ct, TriangleFanDrawMode as Ge, TriangleStripDrawMode as kt, BufferAttribute as ke, Loader as It, LoaderUtils as pe, FileLoader as Tt, MeshPhysicalMaterial as X, Color as ie, LinearSRGBColorSpace as J, SRGBColorSpace as fe, SpotLight as Ht, DirectionalLight as Ut, Matrix4 as Re, InstancedBufferAttribute as Bt, TextureLoader as Vt, ImageBitmapLoader as Wt, InterleavedBuffer as Jt, InterleavedBufferAttribute as Xt, LinearMipmapLinearFilter as yt, NearestMipmapLinearFilter as Yt, LinearMipmapNearestFilter as Zt, NearestMipmapNearestFilter as Qt, LinearFilter as ue, NearestFilter as Rt, RepeatWrapping as qe, MirroredRepeatWrapping as $t, ClampToEdgeWrapping as ea, PointsMaterial as ta, Material as Se, LineBasicMaterial as aa, DoubleSide as sa, MeshBasicMaterial as de, PropertyBinding as ia, SkinnedMesh as na, LineSegments as oa, Line as ra, LineLoop as ca, Points as ba, Group as Me, PerspectiveCamera as ha, OrthographicCamera as la, Skeleton as da, AnimationClip as pa, Bone as fa, InterpolateDiscrete as ua, InterpolateLinear as _t, Texture as We, VectorKeyframeTrack as Je, NumberKeyframeTrack as Xe, QuaternionKeyframeTrack as Ye, ColorManagement as Ze, FrontSide as ma, Interpolant as ga, Box3 as xa, Sphere as Ea, DataTextureLoader as wa, HalfFloatType as me, FloatType as je, DataUtils as ge } from "three";
const Qe = { type: "change" }, Ce = { type: "start" }, St = { type: "end" }, xe = new Gt(), $e = new qt(), ka = Math.cos(70 * mt.DEG2RAD), N = new G(), z = 2 * Math.PI, L = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, Ae = 1e-6;
class Ta extends Ot {
  /**
   * Constructs a new controls instance.
   *
   * @param {Object3D} object - The object that is managed by the controls.
   * @param {?HTMLElement} domElement - The HTML element used for event listeners.
   */
  constructor(e, t = null) {
    super(e, t), this.state = L.NONE, this.target = new G(), this.cursor = new G(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: ce.ROTATE, MIDDLE: ce.DOLLY, RIGHT: ce.PAN }, this.touches = { ONE: re.ROTATE, TWO: re.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._cursorStyle = "auto", this._domElementKeyEvents = null, this._lastPosition = new G(), this._lastQuaternion = new Te(), this._lastTargetPosition = new G(), this._quat = new Te().setFromUnitVectors(e.up, new G(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new Ve(), this._sphericalDelta = new Ve(), this._scale = 1, this._panOffset = new G(), this._rotateStart = new I(), this._rotateEnd = new I(), this._rotateDelta = new I(), this._panStart = new I(), this._panEnd = new I(), this._panDelta = new I(), this._dollyStart = new I(), this._dollyEnd = new I(), this._dollyDelta = new I(), this._dollyDirection = new G(), this._mouse = new I(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Ra.bind(this), this._onPointerDown = ya.bind(this), this._onPointerUp = _a.bind(this), this._onContextMenu = Fa.bind(this), this._onMouseWheel = ja.bind(this), this._onKeyDown = Aa.bind(this), this._onTouchStart = Da.bind(this), this._onTouchMove = va.bind(this), this._onMouseDown = Sa.bind(this), this._onMouseMove = Ma.bind(this), this._interceptControlDown = Pa.bind(this), this._interceptControlUp = La.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
  }
  /**
   * Defines the visual representation of the cursor.
   *
   * @type {('auto'|'grab')}
   * @default 'auto'
   */
  set cursorStyle(e) {
    this._cursorStyle = e, e === "grab" ? this.domElement.style.cursor = "grab" : this.domElement.style.cursor = "auto";
  }
  get cursorStyle() {
    return this._cursorStyle;
  }
  connect(e) {
    super.connect(e), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  /**
   * Get the current vertical rotation, in radians.
   *
   * @return {number} The current vertical rotation, in radians.
   */
  getPolarAngle() {
    return this._spherical.phi;
  }
  /**
   * Get the current horizontal rotation, in radians.
   *
   * @return {number} The current horizontal rotation, in radians.
   */
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  /**
   * Returns the distance from the camera to the target.
   *
   * @return {number} The distance from the camera to the target.
   */
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  /**
   * Adds key event listeners to the given DOM element.
   * `window` is a recommended argument for using this method.
   *
   * @param {HTMLElement} domElement - The DOM element
   */
  listenToKeyEvents(e) {
    e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
  }
  /**
   * Removes the key event listener previously defined with `listenToKeyEvents()`.
   */
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  /**
   * Save the current state of the controls. This can later be recovered with `reset()`.
   */
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  /**
   * Reset the controls to their state from either the last time the `saveState()`
   * was called, or the initial state.
   */
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(Qe), this.update(), this.state = L.NONE;
  }
  /**
   * Programmatically pan the camera.
   *
   * @param {number} deltaX - The horizontal pan amount in pixels.
   * @param {number} deltaY - The vertical pan amount in pixels.
   */
  pan(e, t) {
    this._pan(e, t), this.update();
  }
  /**
   * Programmatically dolly in (zoom in for perspective camera).
   *
   * @param {number} dollyScale - The dolly scale factor.
   */
  dollyIn(e) {
    this._dollyIn(e), this.update();
  }
  /**
   * Programmatically dolly out (zoom out for perspective camera).
   *
   * @param {number} dollyScale - The dolly scale factor.
   */
  dollyOut(e) {
    this._dollyOut(e), this.update();
  }
  /**
   * Programmatically rotate the camera left (around the vertical axis).
   *
   * @param {number} angle - The rotation angle in radians.
   */
  rotateLeft(e) {
    this._rotateLeft(e), this.update();
  }
  /**
   * Programmatically rotate the camera up (around the horizontal axis).
   *
   * @param {number} angle - The rotation angle in radians.
   */
  rotateUp(e) {
    this._rotateUp(e), this.update();
  }
  update(e = null) {
    const t = this.object.position;
    N.copy(t).sub(this.target), N.applyQuaternion(this._quat), this._spherical.setFromVector3(N), this.autoRotate && this.state === L.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let a = this.minAzimuthAngle, s = this.maxAzimuthAngle;
    isFinite(a) && isFinite(s) && (a < -Math.PI ? a += z : a > Math.PI && (a -= z), s < -Math.PI ? s += z : s > Math.PI && (s -= z), a <= s ? this._spherical.theta = Math.max(a, Math.min(s, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (a + s) / 2 ? Math.max(a, this._spherical.theta) : Math.min(s, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let i = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const n = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), i = n != this._spherical.radius;
    }
    if (N.setFromSpherical(this._spherical), N.applyQuaternion(this._quatInverse), t.copy(this.target).add(N), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let n = null;
      if (this.object.isPerspectiveCamera) {
        const r = N.length();
        n = this._clampDistance(r * this._scale);
        const o = r - n;
        this.object.position.addScaledVector(this._dollyDirection, o), this.object.updateMatrixWorld(), i = !!o;
      } else if (this.object.isOrthographicCamera) {
        const r = new G(this._mouse.x, this._mouse.y, 0);
        r.unproject(this.object);
        const o = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = o !== this.object.zoom;
        const b = new G(this._mouse.x, this._mouse.y, 0);
        b.unproject(this.object), this.object.position.sub(b).add(r), this.object.updateMatrixWorld(), n = N.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      n !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(n).add(this.object.position) : (xe.origin.copy(this.object.position), xe.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(xe.direction)) < ka ? this.object.lookAt(this.target) : ($e.setFromNormalAndCoplanarPoint(this.object.up, this.target), xe.intersectPlane($e, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const n = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), n !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > Ae || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > Ae || this._lastTargetPosition.distanceToSquared(this.target) > Ae ? (this.dispatchEvent(Qe), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(e) {
    return e !== null ? z / 60 * this.autoRotateSpeed * e : z / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(e) {
    const t = Math.abs(e * 0.01);
    return Math.pow(0.95, this.zoomSpeed * t);
  }
  _rotateLeft(e) {
    this._sphericalDelta.theta -= e;
  }
  _rotateUp(e) {
    this._sphericalDelta.phi -= e;
  }
  _panLeft(e, t) {
    N.setFromMatrixColumn(t, 0), N.multiplyScalar(-e), this._panOffset.add(N);
  }
  _panUp(e, t) {
    this.screenSpacePanning === !0 ? N.setFromMatrixColumn(t, 1) : (N.setFromMatrixColumn(t, 0), N.crossVectors(this.object.up, N)), N.multiplyScalar(e), this._panOffset.add(N);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(e, t) {
    const a = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const s = this.object.position;
      N.copy(s).sub(this.target);
      let i = N.length();
      i *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * i / a.clientHeight, this.object.matrix), this._panUp(2 * t * i / a.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / a.clientWidth, this.object.matrix), this._panUp(t * (this.object.top - this.object.bottom) / this.object.zoom / a.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(e) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(e, t) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const a = this.domElement.getBoundingClientRect(), s = e - a.left, i = t - a.top, n = a.width, r = a.height;
    this._mouse.x = s / n * 2 - 1, this._mouse.y = -(i / r) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(e) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, e));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(e) {
    this._rotateStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownDolly(e) {
    this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
  }
  _handleMouseDownPan(e) {
    this._panStart.set(e.clientX, e.clientY);
  }
  _handleMouseMoveRotate(e) {
    this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const t = this.domElement;
    this._rotateLeft(z * this._rotateDelta.x / t.clientHeight), this._rotateUp(z * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(e) {
    this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(e) {
    this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(e) {
    this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
  }
  _handleKeyDown(e) {
    let t = !1;
    switch (e.code) {
      case this.keys.UP:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(z * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), t = !0;
        break;
      case this.keys.BOTTOM:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(-z * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), t = !0;
        break;
      case this.keys.LEFT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(z * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), t = !0;
        break;
      case this.keys.RIGHT:
        e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(-z * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), t = !0;
        break;
    }
    t && (e.preventDefault(), this.update());
  }
  _handleTouchStartRotate(e) {
    if (this._pointers.length === 1)
      this._rotateStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), a = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._rotateStart.set(a, s);
    }
  }
  _handleTouchStartPan(e) {
    if (this._pointers.length === 1)
      this._panStart.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), a = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._panStart.set(a, s);
    }
  }
  _handleTouchStartDolly(e) {
    const t = this._getSecondPointerPosition(e), a = e.pageX - t.x, s = e.pageY - t.y, i = Math.sqrt(a * a + s * s);
    this._dollyStart.set(0, i);
  }
  _handleTouchStartDollyPan(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
  }
  _handleTouchStartDollyRotate(e) {
    this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
  }
  _handleTouchMoveRotate(e) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(e.pageX, e.pageY);
    else {
      const a = this._getSecondPointerPosition(e), s = 0.5 * (e.pageX + a.x), i = 0.5 * (e.pageY + a.y);
      this._rotateEnd.set(s, i);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const t = this.domElement;
    this._rotateLeft(z * this._rotateDelta.x / t.clientHeight), this._rotateUp(z * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(e) {
    if (this._pointers.length === 1)
      this._panEnd.set(e.pageX, e.pageY);
    else {
      const t = this._getSecondPointerPosition(e), a = 0.5 * (e.pageX + t.x), s = 0.5 * (e.pageY + t.y);
      this._panEnd.set(a, s);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(e) {
    const t = this._getSecondPointerPosition(e), a = e.pageX - t.x, s = e.pageY - t.y, i = Math.sqrt(a * a + s * s);
    this._dollyEnd.set(0, i), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const n = (e.pageX + t.x) * 0.5, r = (e.pageY + t.y) * 0.5;
    this._updateZoomParameters(n, r);
  }
  _handleTouchMoveDollyPan(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
  }
  _handleTouchMoveDollyRotate(e) {
    this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
  }
  // pointers
  _addPointer(e) {
    this._pointers.push(e.pointerId);
  }
  _removePointer(e) {
    delete this._pointerPositions[e.pointerId];
    for (let t = 0; t < this._pointers.length; t++)
      if (this._pointers[t] == e.pointerId) {
        this._pointers.splice(t, 1);
        return;
      }
  }
  _isTrackingPointer(e) {
    for (let t = 0; t < this._pointers.length; t++)
      if (this._pointers[t] == e.pointerId) return !0;
    return !1;
  }
  _trackPointer(e) {
    let t = this._pointerPositions[e.pointerId];
    t === void 0 && (t = new I(), this._pointerPositions[e.pointerId] = t), t.set(e.pageX, e.pageY);
  }
  _getSecondPointerPosition(e) {
    const t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[t];
  }
  //
  _customWheelEvent(e) {
    const t = e.deltaMode, a = {
      clientX: e.clientX,
      clientY: e.clientY,
      deltaY: e.deltaY
    };
    switch (t) {
      case 1:
        a.deltaY *= 16;
        break;
      case 2:
        a.deltaY *= 100;
        break;
    }
    return e.ctrlKey && !this._controlActive && (a.deltaY *= 10), a;
  }
}
function ya(c) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(c.pointerId), this.domElement.ownerDocument.addEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(c) && (this._addPointer(c), c.pointerType === "touch" ? this._onTouchStart(c) : this._onMouseDown(c), this._cursorStyle === "grab" && (this.domElement.style.cursor = "grabbing")));
}
function Ra(c) {
  this.enabled !== !1 && (c.pointerType === "touch" ? this._onTouchMove(c) : this._onMouseMove(c));
}
function _a(c) {
  switch (this._removePointer(c), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(c.pointerId), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(St), this.state = L.NONE, this._cursorStyle === "grab" && (this.domElement.style.cursor = "grab");
      break;
    case 1:
      const e = this._pointers[0], t = this._pointerPositions[e];
      this._onTouchStart({ pointerId: e, pageX: t.x, pageY: t.y });
      break;
  }
}
function Sa(c) {
  let e;
  switch (c.button) {
    case 0:
      e = this.mouseButtons.LEFT;
      break;
    case 1:
      e = this.mouseButtons.MIDDLE;
      break;
    case 2:
      e = this.mouseButtons.RIGHT;
      break;
    default:
      e = -1;
  }
  switch (e) {
    case ce.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(c), this.state = L.DOLLY;
      break;
    case ce.ROTATE:
      if (c.ctrlKey || c.metaKey || c.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(c), this.state = L.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(c), this.state = L.ROTATE;
      }
      break;
    case ce.PAN:
      if (c.ctrlKey || c.metaKey || c.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(c), this.state = L.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(c), this.state = L.PAN;
      }
      break;
    default:
      this.state = L.NONE;
  }
  this.state !== L.NONE && this.dispatchEvent(Ce);
}
function Ma(c) {
  switch (this.state) {
    case L.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(c);
      break;
    case L.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(c);
      break;
    case L.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(c);
      break;
  }
}
function ja(c) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== L.NONE || (c.preventDefault(), this.dispatchEvent(Ce), this._handleMouseWheel(this._customWheelEvent(c)), this.dispatchEvent(St));
}
function Aa(c) {
  this.enabled !== !1 && this._handleKeyDown(c);
}
function Da(c) {
  switch (this._trackPointer(c), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case re.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(c), this.state = L.TOUCH_ROTATE;
          break;
        case re.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(c), this.state = L.TOUCH_PAN;
          break;
        default:
          this.state = L.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case re.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(c), this.state = L.TOUCH_DOLLY_PAN;
          break;
        case re.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(c), this.state = L.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = L.NONE;
      }
      break;
    default:
      this.state = L.NONE;
  }
  this.state !== L.NONE && this.dispatchEvent(Ce);
}
function va(c) {
  switch (this._trackPointer(c), this.state) {
    case L.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(c), this.update();
      break;
    case L.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(c), this.update();
      break;
    case L.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(c), this.update();
      break;
    case L.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(c), this.update();
      break;
    default:
      this.state = L.NONE;
  }
}
function Fa(c) {
  this.enabled !== !1 && c.preventDefault();
}
function Pa(c) {
  c.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function La(c) {
  c.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
class Oa extends Nt {
  constructor() {
    super(), this.name = "RoomEnvironment", this.position.y = -3.5;
    const e = new gt();
    e.deleteAttribute("uv");
    const t = new ye({ side: Kt }), a = new ye(), s = new xt(16777215, 900, 28, 2);
    s.position.set(0.418, 16.199, 0.3), this.add(s);
    const i = new ee(e, t);
    i.position.set(-0.757, 13.219, 0.717), i.scale.set(31.713, 28.305, 28.591), this.add(i);
    const n = new Et(e, a, 6), r = new ze();
    r.position.set(-10.906, 2.009, 1.846), r.rotation.set(0, -0.195, 0), r.scale.set(2.328, 7.905, 4.651), r.updateMatrix(), n.setMatrixAt(0, r.matrix), r.position.set(-5.607, -0.754, -0.758), r.rotation.set(0, 0.994, 0), r.scale.set(1.97, 1.534, 3.955), r.updateMatrix(), n.setMatrixAt(1, r.matrix), r.position.set(6.167, 0.857, 7.803), r.rotation.set(0, 0.561, 0), r.scale.set(3.927, 6.285, 3.687), r.updateMatrix(), n.setMatrixAt(2, r.matrix), r.position.set(-2.017, 0.018, 6.124), r.rotation.set(0, 0.333, 0), r.scale.set(2.002, 4.566, 2.064), r.updateMatrix(), n.setMatrixAt(3, r.matrix), r.position.set(2.291, -0.756, -2.621), r.rotation.set(0, -0.286, 0), r.scale.set(1.546, 1.552, 1.496), r.updateMatrix(), n.setMatrixAt(4, r.matrix), r.position.set(-2.193, -0.369, -5.547), r.rotation.set(0, 0.516, 0), r.scale.set(3.875, 3.487, 2.986), r.updateMatrix(), n.setMatrixAt(5, r.matrix), this.add(n);
    const o = new ee(e, ne(50));
    o.position.set(-16.116, 14.37, 8.208), o.scale.set(0.1, 2.428, 2.739), this.add(o);
    const b = new ee(e, ne(50));
    b.position.set(-16.109, 18.021, -8.207), b.scale.set(0.1, 2.425, 2.751), this.add(b);
    const h = new ee(e, ne(17));
    h.position.set(14.904, 12.198, -1.832), h.scale.set(0.15, 4.265, 6.331), this.add(h);
    const l = new ee(e, ne(43));
    l.position.set(-0.462, 8.89, 14.52), l.scale.set(4.38, 5.441, 0.088), this.add(l);
    const d = new ee(e, ne(20));
    d.position.set(3.235, 11.486, -12.541), d.scale.set(2.5, 2, 0.1), this.add(d);
    const p = new ee(e, ne(100));
    p.position.set(0, 20, 0), p.scale.set(1, 0.1, 1), this.add(p);
  }
  /**
   * Frees internal resources. This method should be called
   * when the environment is no longer required.
   */
  dispose() {
    const e = /* @__PURE__ */ new Set();
    this.traverse((t) => {
      t.isMesh && (e.add(t.geometry), e.add(t.material));
    });
    for (const t of e)
      t.dispose();
  }
}
function ne(c) {
  return new zt({
    color: 0,
    emissive: 16777215,
    emissiveIntensity: c
  });
}
function Mt(c, e = !1) {
  const t = c[0].index !== null, a = new Set(Object.keys(c[0].attributes)), s = new Set(Object.keys(c[0].morphAttributes)), i = {}, n = {}, r = c[0].morphTargetsRelative, o = new wt();
  let b = 0;
  for (let h = 0; h < c.length; ++h) {
    const l = c[h];
    let d = 0;
    if (t !== (l.index !== null))
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."), null;
    for (const p in l.attributes) {
      if (!a.has(p))
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + '. All geometries must have compatible attributes; make sure "' + p + '" attribute exists among all geometries, or in none of them.'), null;
      i[p] === void 0 && (i[p] = []), i[p].push(l.attributes[p]), d++;
    }
    if (d !== a.size)
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". Make sure all geometries have the same number of attributes."), null;
    if (r !== l.morphTargetsRelative)
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". .morphTargetsRelative must be consistent throughout all geometries."), null;
    for (const p in l.morphAttributes) {
      if (!s.has(p))
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ".  .morphAttributes must be consistent throughout all geometries."), null;
      n[p] === void 0 && (n[p] = []), n[p].push(l.morphAttributes[p]);
    }
    if (e) {
      let p;
      if (t)
        p = l.index.count;
      else if (l.attributes.position !== void 0)
        p = l.attributes.position.count;
      else
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + h + ". The geometry must have either an index or a position attribute"), null;
      o.addGroup(b, p, h), b += p;
    }
  }
  if (t) {
    let h = 0;
    const l = [];
    for (let d = 0; d < c.length; ++d) {
      const p = c[d].index;
      for (let E = 0; E < p.count; ++E)
        l.push(p.getX(E) + h);
      h += c[d].attributes.position.count;
    }
    o.setIndex(l);
  }
  for (const h in i) {
    const l = et(i[h]);
    if (!l)
      return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + h + " attribute."), null;
    o.setAttribute(h, l);
  }
  for (const h in n) {
    const l = n[h][0].length;
    if (l === 0) break;
    o.morphAttributes = o.morphAttributes || {}, o.morphAttributes[h] = [];
    for (let d = 0; d < l; ++d) {
      const p = [];
      for (let w = 0; w < n[h].length; ++w)
        p.push(n[h][w][d]);
      const E = et(p);
      if (!E)
        return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + h + " morphAttribute."), null;
      o.morphAttributes[h].push(E);
    }
  }
  return o;
}
function et(c) {
  let e, t, a, s = -1, i = 0;
  for (let b = 0; b < c.length; ++b) {
    const h = c[b];
    if (e === void 0 && (e = h.array.constructor), e !== h.array.constructor)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."), null;
    if (t === void 0 && (t = h.itemSize), t !== h.itemSize)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."), null;
    if (a === void 0 && (a = h.normalized), a !== h.normalized)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."), null;
    if (s === -1 && (s = h.gpuType), s !== h.gpuType)
      return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."), null;
    i += h.count * t;
  }
  const n = new e(i), r = new ke(n, t, a);
  let o = 0;
  for (let b = 0; b < c.length; ++b) {
    const h = c[b];
    if (h.isInterleavedBufferAttribute) {
      const l = o / t;
      for (let d = 0, p = h.count; d < p; d++)
        for (let E = 0; E < t; E++) {
          const w = h.getComponent(d, E);
          r.setComponent(d + l, E, w);
        }
    } else
      n.set(h.array, o);
    o += h.count * t;
  }
  return s !== void 0 && (r.gpuType = s), r;
}
function tt(c, e) {
  if (e === Ct)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), c;
  if (e === Ge || e === kt) {
    let t = c.getIndex();
    if (t === null) {
      const n = [], r = c.getAttribute("position");
      if (r !== void 0) {
        for (let o = 0; o < r.count; o++)
          n.push(o);
        c.setIndex(n), t = c.getIndex();
      } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), c;
    }
    const a = t.count - 2, s = [];
    if (e === Ge)
      for (let n = 1; n <= a; n++)
        s.push(t.getX(0)), s.push(t.getX(n)), s.push(t.getX(n + 1));
    else
      for (let n = 0; n < a; n++)
        n % 2 === 0 ? (s.push(t.getX(n)), s.push(t.getX(n + 1)), s.push(t.getX(n + 2))) : (s.push(t.getX(n + 2)), s.push(t.getX(n + 1)), s.push(t.getX(n)));
    s.length / 3 !== a && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const i = c.clone();
    return i.setIndex(s), i.clearGroups(), i;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), c;
}
function Ga(c) {
  const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), a = c.clone();
  return jt(c, a, function(s, i) {
    e.set(i, s), t.set(s, i);
  }), a.traverse(function(s) {
    if (!s.isSkinnedMesh) return;
    const i = s, n = e.get(s), r = n.skeleton.bones;
    i.skeleton = n.skeleton.clone(), i.bindMatrix.copy(n.bindMatrix), i.skeleton.bones = r.map(function(o) {
      return t.get(o);
    }), i.bind(i.skeleton, i.bindMatrix);
  }), a;
}
function jt(c, e, t) {
  t(c, e);
  for (let a = 0; a < c.children.length; a++)
    jt(c.children[a], e.children[a], t);
}
class qa extends It {
  /**
   * Constructs a new glTF loader.
   *
   * @param {LoadingManager} [manager] - The loading manager.
   */
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new Ia(t);
    }), this.register(function(t) {
      return new Ha(t);
    }), this.register(function(t) {
      return new Qa(t);
    }), this.register(function(t) {
      return new $a(t);
    }), this.register(function(t) {
      return new es(t);
    }), this.register(function(t) {
      return new Ba(t);
    }), this.register(function(t) {
      return new Va(t);
    }), this.register(function(t) {
      return new Wa(t);
    }), this.register(function(t) {
      return new Ja(t);
    }), this.register(function(t) {
      return new Ca(t);
    }), this.register(function(t) {
      return new Xa(t);
    }), this.register(function(t) {
      return new Ua(t);
    }), this.register(function(t) {
      return new Za(t);
    }), this.register(function(t) {
      return new Ya(t);
    }), this.register(function(t) {
      return new Ka(t);
    }), this.register(function(t) {
      return new at(t, j.EXT_MESHOPT_COMPRESSION);
    }), this.register(function(t) {
      return new at(t, j.KHR_MESHOPT_COMPRESSION);
    }), this.register(function(t) {
      return new ts(t);
    });
  }
  /**
   * Starts loading from the given URL and passes the loaded glTF asset
   * to the `onLoad()` callback.
   *
   * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onProgressCallback} onProgress - Executed while the loading is in progress.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  load(e, t, a, s) {
    const i = this;
    let n;
    if (this.resourcePath !== "")
      n = this.resourcePath;
    else if (this.path !== "") {
      const b = pe.extractUrlBase(e);
      n = pe.resolveURL(b, this.path);
    } else
      n = pe.extractUrlBase(e);
    this.manager.itemStart(e);
    const r = function(b) {
      s ? s(b) : console.error(b), i.manager.itemError(e), i.manager.itemEnd(e);
    }, o = new Tt(this.manager);
    o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(e, function(b) {
      try {
        i.parse(b, n, function(h) {
          t(h), i.manager.itemEnd(e);
        }, r);
      } catch (h) {
        r(h);
      }
    }, a, r);
  }
  /**
   * Sets the given Draco loader to this loader. Required for decoding assets
   * compressed with the `KHR_draco_mesh_compression` extension.
   *
   * @param {DRACOLoader} dracoLoader - The Draco loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  /**
   * Sets the given KTX2 loader to this loader. Required for loading KTX2
   * compressed textures.
   *
   * @param {KTX2Loader} ktx2Loader - The KTX2 loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  /**
   * Sets the given meshopt decoder. Required for decoding assets
   * compressed with the `EXT_meshopt_compression` extension.
   *
   * @param {Object} meshoptDecoder - The meshopt decoder to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  /**
   * Registers a plugin callback. This API is internally used to implement the various
   * glTF extensions but can also used by third-party code to add additional logic
   * to the loader.
   *
   * @param {function(parser:GLTFParser)} callback - The callback function to register.
   * @return {GLTFLoader} A reference to this loader.
   */
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  /**
   * Unregisters a plugin callback.
   *
   * @param {Function} callback - The callback function to unregister.
   * @return {GLTFLoader} A reference to this loader.
   */
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  /**
   * Parses the given glTF data and returns the resulting group.
   *
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  parse(e, t, a, s) {
    let i;
    const n = {}, r = {}, o = new TextDecoder();
    if (typeof e == "string")
      i = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (o.decode(new Uint8Array(e, 0, 4)) === At) {
        try {
          n[j.KHR_BINARY_GLTF] = new as(e);
        } catch (l) {
          s && s(l);
          return;
        }
        i = JSON.parse(n[j.KHR_BINARY_GLTF].content);
      } else
        i = JSON.parse(o.decode(e));
    else
      i = e;
    if (i.asset === void 0 || i.asset.version[0] < 2) {
      s && s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const b = new us(i, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    b.fileLoader.setRequestHeader(this.requestHeader);
    for (let h = 0; h < this.pluginCallbacks.length; h++) {
      const l = this.pluginCallbacks[h](b);
      l.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), r[l.name] = l, n[l.name] = !0;
    }
    if (i.extensionsUsed)
      for (let h = 0; h < i.extensionsUsed.length; ++h) {
        const l = i.extensionsUsed[h], d = i.extensionsRequired || [];
        switch (l) {
          case j.KHR_MATERIALS_UNLIT:
            n[l] = new za();
            break;
          case j.KHR_DRACO_MESH_COMPRESSION:
            n[l] = new ss(i, this.dracoLoader);
            break;
          case j.KHR_TEXTURE_TRANSFORM:
            n[l] = new is();
            break;
          case j.KHR_MESH_QUANTIZATION:
            n[l] = new ns();
            break;
          default:
            d.indexOf(l) >= 0 && r[l] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + l + '".');
        }
      }
    b.setExtensions(n), b.setPlugins(r), b.parse(a, s);
  }
  /**
   * Async version of {@link GLTFLoader#parse}.
   *
   * @async
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @return {Promise<GLTFLoader~LoadObject>} A Promise that resolves with the loaded glTF when the parsing has been finished.
   */
  parseAsync(e, t) {
    const a = this;
    return new Promise(function(s, i) {
      a.parse(e, t, s, i);
    });
  }
}
function Na() {
  let c = {};
  return {
    get: function(e) {
      return c[e];
    },
    add: function(e, t) {
      c[e] = t;
    },
    remove: function(e) {
      delete c[e];
    },
    removeAll: function() {
      c = {};
    }
  };
}
function q(c, e, t) {
  const a = c.json.materials[e];
  return a.extensions && a.extensions[t] ? a.extensions[t] : null;
}
const j = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class Ka {
  constructor(e) {
    this.parser = e, this.name = j.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let a = 0, s = t.length; a < s; a++) {
      const i = t[a];
      i.extensions && i.extensions[this.name] && i.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, i.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, a = "light:" + e;
    let s = t.cache.get(a);
    if (s) return s;
    const i = t.json, o = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e];
    let b;
    const h = new ie(16777215);
    o.color !== void 0 && h.setRGB(o.color[0], o.color[1], o.color[2], J);
    const l = o.range !== void 0 ? o.range : 0;
    switch (o.type) {
      case "directional":
        b = new Ut(h), b.target.position.set(0, 0, -1), b.add(b.target);
        break;
      case "point":
        b = new xt(h), b.distance = l;
        break;
      case "spot":
        b = new Ht(h), b.distance = l, o.spot = o.spot || {}, o.spot.innerConeAngle = o.spot.innerConeAngle !== void 0 ? o.spot.innerConeAngle : 0, o.spot.outerConeAngle = o.spot.outerConeAngle !== void 0 ? o.spot.outerConeAngle : Math.PI / 4, b.angle = o.spot.outerConeAngle, b.penumbra = 1 - o.spot.innerConeAngle / o.spot.outerConeAngle, b.target.position.set(0, 0, -1), b.add(b.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + o.type);
    }
    return b.position.set(0, 0, 0), W(b, o), o.intensity !== void 0 && (b.intensity = o.intensity), b.name = t.createUniqueName(o.name || "light_" + e), s = Promise.resolve(b), t.cache.add(a, s), s;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, a = this.parser, i = a.json.nodes[e], r = (i.extensions && i.extensions[this.name] || {}).light;
    return r === void 0 ? null : this._loadLight(r).then(function(o) {
      return a._getNodeRef(t.cache, r, o);
    });
  }
}
class za {
  constructor() {
    this.name = j.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return de;
  }
  extendParams(e, t, a) {
    const s = [];
    e.color = new ie(1, 1, 1), e.opacity = 1;
    const i = t.pbrMetallicRoughness;
    if (i) {
      if (Array.isArray(i.baseColorFactor)) {
        const n = i.baseColorFactor;
        e.color.setRGB(n[0], n[1], n[2], J), e.opacity = n[3];
      }
      i.baseColorTexture !== void 0 && s.push(a.assignTexture(e, "map", i.baseColorTexture, fe));
    }
    return Promise.all(s);
  }
}
class Ca {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    return a === null || a.emissiveStrength !== void 0 && (t.emissiveIntensity = a.emissiveStrength), Promise.resolve();
  }
}
class Ia {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    if (a.clearcoatFactor !== void 0 && (t.clearcoat = a.clearcoatFactor), a.clearcoatTexture !== void 0 && s.push(this.parser.assignTexture(t, "clearcoatMap", a.clearcoatTexture)), a.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = a.clearcoatRoughnessFactor), a.clearcoatRoughnessTexture !== void 0 && s.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", a.clearcoatRoughnessTexture)), a.clearcoatNormalTexture !== void 0 && (s.push(this.parser.assignTexture(t, "clearcoatNormalMap", a.clearcoatNormalTexture)), a.clearcoatNormalTexture.scale !== void 0)) {
      const i = a.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new I(i, i);
    }
    return Promise.all(s);
  }
}
class Ha {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    return a === null || (t.dispersion = a.dispersion !== void 0 ? a.dispersion : 0), Promise.resolve();
  }
}
class Ua {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    return a.iridescenceFactor !== void 0 && (t.iridescence = a.iridescenceFactor), a.iridescenceTexture !== void 0 && s.push(this.parser.assignTexture(t, "iridescenceMap", a.iridescenceTexture)), a.iridescenceIor !== void 0 && (t.iridescenceIOR = a.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), a.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = a.iridescenceThicknessMinimum), a.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = a.iridescenceThicknessMaximum), a.iridescenceThicknessTexture !== void 0 && s.push(this.parser.assignTexture(t, "iridescenceThicknessMap", a.iridescenceThicknessTexture)), Promise.all(s);
  }
}
class Ba {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    if (t.sheenColor = new ie(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, a.sheenColorFactor !== void 0) {
      const i = a.sheenColorFactor;
      t.sheenColor.setRGB(i[0], i[1], i[2], J);
    }
    return a.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = a.sheenRoughnessFactor), a.sheenColorTexture !== void 0 && s.push(this.parser.assignTexture(t, "sheenColorMap", a.sheenColorTexture, fe)), a.sheenRoughnessTexture !== void 0 && s.push(this.parser.assignTexture(t, "sheenRoughnessMap", a.sheenRoughnessTexture)), Promise.all(s);
  }
}
class Va {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    return a.transmissionFactor !== void 0 && (t.transmission = a.transmissionFactor), a.transmissionTexture !== void 0 && s.push(this.parser.assignTexture(t, "transmissionMap", a.transmissionTexture)), Promise.all(s);
  }
}
class Wa {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    t.thickness = a.thicknessFactor !== void 0 ? a.thicknessFactor : 0, a.thicknessTexture !== void 0 && s.push(this.parser.assignTexture(t, "thicknessMap", a.thicknessTexture)), t.attenuationDistance = a.attenuationDistance || 1 / 0;
    const i = a.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new ie().setRGB(i[0], i[1], i[2], J), Promise.all(s);
  }
}
class Ja {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    return a === null || (t.ior = a.ior !== void 0 ? a.ior : 1.5), Promise.resolve();
  }
}
class Xa {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    t.specularIntensity = a.specularFactor !== void 0 ? a.specularFactor : 1, a.specularTexture !== void 0 && s.push(this.parser.assignTexture(t, "specularIntensityMap", a.specularTexture));
    const i = a.specularColorFactor || [1, 1, 1];
    return t.specularColor = new ie().setRGB(i[0], i[1], i[2], J), a.specularColorTexture !== void 0 && s.push(this.parser.assignTexture(t, "specularColorMap", a.specularColorTexture, fe)), Promise.all(s);
  }
}
class Ya {
  constructor(e) {
    this.parser = e, this.name = j.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    return t.bumpScale = a.bumpFactor !== void 0 ? a.bumpFactor : 1, a.bumpTexture !== void 0 && s.push(this.parser.assignTexture(t, "bumpMap", a.bumpTexture)), Promise.all(s);
  }
}
class Za {
  constructor(e) {
    this.parser = e, this.name = j.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    return q(this.parser, e, this.name) !== null ? X : null;
  }
  extendMaterialParams(e, t) {
    const a = q(this.parser, e, this.name);
    if (a === null) return Promise.resolve();
    const s = [];
    return a.anisotropyStrength !== void 0 && (t.anisotropy = a.anisotropyStrength), a.anisotropyRotation !== void 0 && (t.anisotropyRotation = a.anisotropyRotation), a.anisotropyTexture !== void 0 && s.push(this.parser.assignTexture(t, "anisotropyMap", a.anisotropyTexture)), Promise.all(s);
  }
}
class Qa {
  constructor(e) {
    this.parser = e, this.name = j.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, a = t.json, s = a.textures[e];
    if (!s.extensions || !s.extensions[this.name])
      return null;
    const i = s.extensions[this.name], n = t.options.ktx2Loader;
    if (!n) {
      if (a.extensionsRequired && a.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, i.source, n);
  }
}
class $a {
  constructor(e) {
    this.parser = e, this.name = j.EXT_TEXTURE_WEBP;
  }
  loadTexture(e) {
    const t = this.name, a = this.parser, s = a.json, i = s.textures[e];
    if (!i.extensions || !i.extensions[t])
      return null;
    const n = i.extensions[t], r = s.images[n.source];
    let o = a.textureLoader;
    if (r.uri) {
      const b = a.options.manager.getHandler(r.uri);
      b !== null && (o = b);
    }
    return a.loadTextureImage(e, n.source, o);
  }
}
class es {
  constructor(e) {
    this.parser = e, this.name = j.EXT_TEXTURE_AVIF;
  }
  loadTexture(e) {
    const t = this.name, a = this.parser, s = a.json, i = s.textures[e];
    if (!i.extensions || !i.extensions[t])
      return null;
    const n = i.extensions[t], r = s.images[n.source];
    let o = a.textureLoader;
    if (r.uri) {
      const b = a.options.manager.getHandler(r.uri);
      b !== null && (o = b);
    }
    return a.loadTextureImage(e, n.source, o);
  }
}
class at {
  constructor(e, t) {
    this.name = t, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, a = t.bufferViews[e];
    if (a.extensions && a.extensions[this.name]) {
      const s = a.extensions[this.name], i = this.parser.getDependency("buffer", s.buffer), n = this.parser.options.meshoptDecoder;
      if (!n || !n.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return i.then(function(r) {
        const o = s.byteOffset || 0, b = s.byteLength || 0, h = s.count, l = s.byteStride, d = new Uint8Array(r, o, b);
        return n.decodeGltfBufferAsync ? n.decodeGltfBufferAsync(h, l, d, s.mode, s.filter).then(function(p) {
          return p.buffer;
        }) : n.ready.then(function() {
          const p = new ArrayBuffer(h * l);
          return n.decodeGltfBuffer(new Uint8Array(p), h, l, d, s.mode, s.filter), p;
        });
      });
    } else
      return null;
  }
}
class ts {
  constructor(e) {
    this.name = j.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, a = t.nodes[e];
    if (!a.extensions || !a.extensions[this.name] || a.mesh === void 0)
      return null;
    const s = t.meshes[a.mesh];
    for (const b of s.primitives)
      if (b.mode !== B.TRIANGLES && b.mode !== B.TRIANGLE_STRIP && b.mode !== B.TRIANGLE_FAN && b.mode !== void 0)
        return null;
    const n = a.extensions[this.name].attributes, r = [], o = {};
    for (const b in n)
      r.push(this.parser.getDependency("accessor", n[b]).then((h) => (o[b] = h, o[b])));
    return r.length < 1 ? null : (r.push(this.parser.createNodeMesh(e)), Promise.all(r).then((b) => {
      const h = b.pop(), l = h.isGroup ? h.children : [h], d = b[0].count, p = [];
      for (const E of l) {
        const w = new Re(), g = new G(), f = new Te(), u = new G(1, 1, 1), T = new Et(E.geometry, E.material, d);
        for (let k = 0; k < d; k++)
          o.TRANSLATION && g.fromBufferAttribute(o.TRANSLATION, k), o.ROTATION && f.fromBufferAttribute(o.ROTATION, k), o.SCALE && u.fromBufferAttribute(o.SCALE, k), T.setMatrixAt(k, w.compose(g, f, u));
        for (const k in o)
          if (k === "_COLOR_0") {
            const _ = o[k];
            T.instanceColor = new Bt(_.array, _.itemSize, _.normalized);
          } else k !== "TRANSLATION" && k !== "ROTATION" && k !== "SCALE" && E.geometry.setAttribute(k, o[k]);
        ze.prototype.copy.call(T, E), this.parser.assignFinalMaterial(T), p.push(T);
      }
      return h.isGroup ? (h.clear(), h.add(...p), h) : p[0];
    }));
  }
}
const At = "glTF", he = 12, st = { JSON: 1313821514, BIN: 5130562 };
class as {
  constructor(e) {
    this.name = j.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, he), a = new TextDecoder();
    if (this.header = {
      magic: a.decode(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== At)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - he, i = new DataView(e, he);
    let n = 0;
    for (; n < s; ) {
      const r = i.getUint32(n, !0);
      n += 4;
      const o = i.getUint32(n, !0);
      if (n += 4, o === st.JSON) {
        const b = new Uint8Array(e, he + n, r);
        this.content = a.decode(b);
      } else if (o === st.BIN) {
        const b = he + n;
        this.body = e.slice(b, b + r);
      }
      n += r;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class ss {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = j.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const a = this.json, s = this.dracoLoader, i = e.extensions[this.name].bufferView, n = e.extensions[this.name].attributes, r = {}, o = {}, b = {};
    for (const h in n) {
      const l = Ne[h] || h.toLowerCase();
      r[l] = n[h];
    }
    for (const h in e.attributes) {
      const l = Ne[h] || h.toLowerCase();
      if (n[h] !== void 0) {
        const d = a.accessors[e.attributes[h]], p = be[d.componentType];
        b[l] = p.name, o[l] = d.normalized === !0;
      }
    }
    return t.getDependency("bufferView", i).then(function(h) {
      return new Promise(function(l, d) {
        s.decodeDracoFile(h, function(p) {
          for (const E in p.attributes) {
            const w = p.attributes[E], g = o[E];
            g !== void 0 && (w.normalized = g);
          }
          l(p);
        }, r, b, J, d);
      });
    });
  }
}
class is {
  constructor() {
    this.name = j.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class ns {
  constructor() {
    this.name = j.KHR_MESH_QUANTIZATION;
  }
}
class Dt extends ga {
  constructor(e, t, a, s) {
    super(e, t, a, s);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, a = this.sampleValues, s = this.valueSize, i = e * s * 3 + s;
    for (let n = 0; n !== s; n++)
      t[n] = a[i + n];
    return t;
  }
  interpolate_(e, t, a, s) {
    const i = this.resultBuffer, n = this.sampleValues, r = this.valueSize, o = r * 2, b = r * 3, h = s - t, l = (a - t) / h, d = l * l, p = d * l, E = e * b, w = E - b, g = -2 * p + 3 * d, f = p - d, u = 1 - g, T = f - d + l;
    for (let k = 0; k !== r; k++) {
      const _ = n[w + k + r], A = n[w + k + o] * h, v = n[E + k + r], y = n[E + k] * h;
      i[k] = u * _ + T * A + g * v + f * y;
    }
    return i;
  }
}
const os = new Te();
class rs extends Dt {
  interpolate_(e, t, a, s) {
    const i = super.interpolate_(e, t, a, s);
    return os.fromArray(i).normalize().toArray(i), i;
  }
}
const B = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
}, be = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, it = {
  9728: Rt,
  9729: ue,
  9984: Qt,
  9985: Zt,
  9986: Yt,
  9987: yt
}, nt = {
  33071: ea,
  33648: $t,
  10497: qe
}, De = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, Ne = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, $ = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, cs = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: _t,
  STEP: ua
}, ve = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function bs(c) {
  return c.DefaultMaterial === void 0 && (c.DefaultMaterial = new ye({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: ma
  })), c.DefaultMaterial;
}
function ae(c, e, t) {
  for (const a in t.extensions)
    c[a] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[a] = t.extensions[a]);
}
function W(c, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(c.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function hs(c, e, t) {
  let a = !1, s = !1, i = !1;
  for (let b = 0, h = e.length; b < h; b++) {
    const l = e[b];
    if (l.POSITION !== void 0 && (a = !0), l.NORMAL !== void 0 && (s = !0), l.COLOR_0 !== void 0 && (i = !0), a && s && i) break;
  }
  if (!a && !s && !i) return Promise.resolve(c);
  const n = [], r = [], o = [];
  for (let b = 0, h = e.length; b < h; b++) {
    const l = e[b];
    if (a) {
      const d = l.POSITION !== void 0 ? t.getDependency("accessor", l.POSITION) : c.attributes.position;
      n.push(d);
    }
    if (s) {
      const d = l.NORMAL !== void 0 ? t.getDependency("accessor", l.NORMAL) : c.attributes.normal;
      r.push(d);
    }
    if (i) {
      const d = l.COLOR_0 !== void 0 ? t.getDependency("accessor", l.COLOR_0) : c.attributes.color;
      o.push(d);
    }
  }
  return Promise.all([
    Promise.all(n),
    Promise.all(r),
    Promise.all(o)
  ]).then(function(b) {
    const h = b[0], l = b[1], d = b[2];
    return a && (c.morphAttributes.position = h), s && (c.morphAttributes.normal = l), i && (c.morphAttributes.color = d), c.morphTargetsRelative = !0, c;
  });
}
function ls(c, e) {
  if (c.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, a = e.weights.length; t < a; t++)
      c.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (c.morphTargetInfluences.length === t.length) {
      c.morphTargetDictionary = {};
      for (let a = 0, s = t.length; a < s; a++)
        c.morphTargetDictionary[t[a]] = a;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function ds(c) {
  let e;
  const t = c.extensions && c.extensions[j.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + Fe(t.attributes) : e = c.indices + ":" + Fe(c.attributes) + ":" + c.mode, c.targets !== void 0)
    for (let a = 0, s = c.targets.length; a < s; a++)
      e += ":" + Fe(c.targets[a]);
  return e;
}
function Fe(c) {
  let e = "";
  const t = Object.keys(c).sort();
  for (let a = 0, s = t.length; a < s; a++)
    e += t[a] + ":" + c[t[a]] + ";";
  return e;
}
function Ke(c) {
  switch (c) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function ps(c) {
  return c.search(/\.jpe?g($|\?)/i) > 0 || c.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : c.search(/\.webp($|\?)/i) > 0 || c.search(/^data\:image\/webp/) === 0 ? "image/webp" : c.search(/\.ktx2($|\?)/i) > 0 || c.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
const fs = new Re();
class us {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Na(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let a = !1, s = -1, i = !1, n = -1;
    if (typeof navigator < "u" && typeof navigator.userAgent < "u") {
      const r = navigator.userAgent;
      a = /^((?!chrome|android).)*safari/i.test(r) === !0;
      const o = r.match(/Version\/(\d+)/);
      s = a && o ? parseInt(o[1], 10) : -1, i = r.indexOf("Firefox") > -1, n = i ? r.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    typeof createImageBitmap > "u" || a && s < 17 || i && n < 98 ? this.textureLoader = new Vt(this.options.manager) : this.textureLoader = new Wt(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new Tt(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const a = this, s = this.json, i = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(n) {
      return n._markDefs && n._markDefs();
    }), Promise.all(this._invokeAll(function(n) {
      return n.beforeRoot && n.beforeRoot();
    })).then(function() {
      return Promise.all([
        a.getDependencies("scene"),
        a.getDependencies("animation"),
        a.getDependencies("camera")
      ]);
    }).then(function(n) {
      const r = {
        scene: n[0][s.scene || 0],
        scenes: n[0],
        animations: n[1],
        cameras: n[2],
        asset: s.asset,
        parser: a,
        userData: {}
      };
      return ae(i, r, s), W(r, s), Promise.all(a._invokeAll(function(o) {
        return o.afterRoot && o.afterRoot(r);
      })).then(function() {
        for (const o of r.scenes)
          o.updateMatrixWorld();
        e(r);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   *
   * @private
   */
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], a = this.json.meshes || [];
    for (let s = 0, i = t.length; s < i; s++) {
      const n = t[s].joints;
      for (let r = 0, o = n.length; r < o; r++)
        e[n[r]].isBone = !0;
    }
    for (let s = 0, i = e.length; s < i; s++) {
      const n = e[s];
      n.mesh !== void 0 && (this._addNodeRef(this.meshCache, n.mesh), n.skin !== void 0 && (a[n.mesh].isSkinnedMesh = !0)), n.camera !== void 0 && this._addNodeRef(this.cameraCache, n.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   *
   * @private
   * @param {Object} cache
   * @param {Object3D} index
   */
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  /**
   * Returns a reference to a shared resource, cloning it if necessary.
   *
   * @private
   * @param {Object} cache
   * @param {number} index
   * @param {Object} object
   * @return {Object}
   */
  _getNodeRef(e, t, a) {
    if (e.refs[t] <= 1) return a;
    const s = a.clone(), i = (n, r) => {
      const o = this.associations.get(n);
      o != null && this.associations.set(r, o);
      for (const [b, h] of n.children.entries())
        i(h, r.children[b]);
    };
    return i(a, s), s.name += "_instance_" + e.uses[t]++, s;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let a = 0; a < t.length; a++) {
      const s = e(t[a]);
      if (s) return s;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const a = [];
    for (let s = 0; s < t.length; s++) {
      const i = e(t[s]);
      i && a.push(i);
    }
    return a;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const a = e + ":" + t;
    let s = this.cache.get(a);
    if (!s) {
      switch (e) {
        case "scene":
          s = this.loadScene(t);
          break;
        case "node":
          s = this._invokeOne(function(i) {
            return i.loadNode && i.loadNode(t);
          });
          break;
        case "mesh":
          s = this._invokeOne(function(i) {
            return i.loadMesh && i.loadMesh(t);
          });
          break;
        case "accessor":
          s = this.loadAccessor(t);
          break;
        case "bufferView":
          s = this._invokeOne(function(i) {
            return i.loadBufferView && i.loadBufferView(t);
          });
          break;
        case "buffer":
          s = this.loadBuffer(t);
          break;
        case "material":
          s = this._invokeOne(function(i) {
            return i.loadMaterial && i.loadMaterial(t);
          });
          break;
        case "texture":
          s = this._invokeOne(function(i) {
            return i.loadTexture && i.loadTexture(t);
          });
          break;
        case "skin":
          s = this.loadSkin(t);
          break;
        case "animation":
          s = this._invokeOne(function(i) {
            return i.loadAnimation && i.loadAnimation(t);
          });
          break;
        case "camera":
          s = this.loadCamera(t);
          break;
        default:
          if (s = this._invokeOne(function(i) {
            return i != this && i.getDependency && i.getDependency(e, t);
          }), !s)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(a, s);
    }
    return s;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const a = this, s = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(s.map(function(i, n) {
        return a.getDependency(e, n);
      })), this.cache.add(e, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(e) {
    const t = this.json.buffers[e], a = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[j.KHR_BINARY_GLTF].body);
    const s = this.options;
    return new Promise(function(i, n) {
      a.load(pe.resolveURL(t.uri, s.path), i, void 0, function() {
        n(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(a) {
      const s = t.byteLength || 0, i = t.byteOffset || 0;
      return a.slice(i, i + s);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   *
   * @private
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, a = this.json, s = this.json.accessors[e];
    if (s.bufferView === void 0 && s.sparse === void 0) {
      const n = De[s.type], r = be[s.componentType], o = s.normalized === !0, b = new r(s.count * n);
      return Promise.resolve(new ke(b, n, o));
    }
    const i = [];
    return s.bufferView !== void 0 ? i.push(this.getDependency("bufferView", s.bufferView)) : i.push(null), s.sparse !== void 0 && (i.push(this.getDependency("bufferView", s.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", s.sparse.values.bufferView))), Promise.all(i).then(function(n) {
      const r = n[0], o = De[s.type], b = be[s.componentType], h = b.BYTES_PER_ELEMENT, l = h * o, d = s.byteOffset || 0, p = s.bufferView !== void 0 ? a.bufferViews[s.bufferView].byteStride : void 0, E = s.normalized === !0;
      let w, g;
      if (p && p !== l) {
        const f = Math.floor(d / p), u = "InterleavedBuffer:" + s.bufferView + ":" + s.componentType + ":" + f + ":" + s.count;
        let T = t.cache.get(u);
        T || (w = new b(r, f * p, s.count * p / h), T = new Jt(w, p / h), t.cache.add(u, T)), g = new Xt(T, o, d % p / h, E);
      } else
        r === null ? w = new b(s.count * o) : w = new b(r, d, s.count * o), g = new ke(w, o, E);
      if (s.sparse !== void 0) {
        const f = De.SCALAR, u = be[s.sparse.indices.componentType], T = s.sparse.indices.byteOffset || 0, k = s.sparse.values.byteOffset || 0, _ = new u(n[1], T, s.sparse.count * f), A = new b(n[2], k, s.sparse.count * o);
        r !== null && (g = new ke(g.array.slice(), g.itemSize, g.normalized)), g.normalized = !1;
        for (let v = 0, y = _.length; v < y; v++) {
          const M = _[v];
          if (g.setX(M, A[v * o]), o >= 2 && g.setY(M, A[v * o + 1]), o >= 3 && g.setZ(M, A[v * o + 2]), o >= 4 && g.setW(M, A[v * o + 3]), o >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        g.normalized = E;
      }
      return g;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   *
   * @private
   * @param {number} textureIndex
   * @return {Promise<?Texture>}
   */
  loadTexture(e) {
    const t = this.json, a = this.options, i = t.textures[e].source, n = t.images[i];
    let r = this.textureLoader;
    if (n.uri) {
      const o = a.manager.getHandler(n.uri);
      o !== null && (r = o);
    }
    return this.loadTextureImage(e, i, r);
  }
  loadTextureImage(e, t, a) {
    const s = this, i = this.json, n = i.textures[e], r = i.images[t], o = (r.uri || r.bufferView) + ":" + n.sampler;
    if (this.textureCache[o])
      return this.textureCache[o];
    const b = this.loadImageSource(t, a).then(function(h) {
      h.flipY = !1, h.name = n.name || r.name || "", h.name === "" && typeof r.uri == "string" && r.uri.startsWith("data:image/") === !1 && (h.name = r.uri);
      const d = (i.samplers || {})[n.sampler] || {};
      return h.magFilter = it[d.magFilter] || ue, h.minFilter = it[d.minFilter] || yt, h.wrapS = nt[d.wrapS] || qe, h.wrapT = nt[d.wrapT] || qe, h.generateMipmaps = !h.isCompressedTexture && h.minFilter !== Rt && h.minFilter !== ue, s.associations.set(h, { textures: e }), h;
    }).catch(function() {
      return null;
    });
    return this.textureCache[o] = b, b;
  }
  loadImageSource(e, t) {
    const a = this, s = this.json, i = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((l) => l.clone());
    const n = s.images[e], r = self.URL || self.webkitURL;
    let o = n.uri || "", b = !1;
    if (n.bufferView !== void 0)
      o = a.getDependency("bufferView", n.bufferView).then(function(l) {
        b = !0;
        const d = new Blob([l], { type: n.mimeType });
        return o = r.createObjectURL(d), o;
      });
    else if (n.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const h = Promise.resolve(o).then(function(l) {
      return new Promise(function(d, p) {
        let E = d;
        t.isImageBitmapLoader === !0 && (E = function(w) {
          const g = new We(w);
          g.needsUpdate = !0, d(g);
        }), t.load(pe.resolveURL(l, i.path), E, void 0, p);
      });
    }).then(function(l) {
      return b === !0 && r.revokeObjectURL(o), W(l, n), l.userData.mimeType = n.mimeType || ps(n.uri), l;
    }).catch(function(l) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", o), l;
    });
    return this.sourceCache[e] = h, h;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   *
   * @private
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @param {string} [colorSpace]
   * @return {Promise<Texture>}
   */
  assignTexture(e, t, a, s) {
    const i = this;
    return this.getDependency("texture", a.index).then(function(n) {
      if (!n) return null;
      if (a.texCoord !== void 0 && a.texCoord > 0 && (n = n.clone(), n.channel = a.texCoord), i.extensions[j.KHR_TEXTURE_TRANSFORM]) {
        const r = a.extensions !== void 0 ? a.extensions[j.KHR_TEXTURE_TRANSFORM] : void 0;
        if (r) {
          const o = i.associations.get(n);
          n = i.extensions[j.KHR_TEXTURE_TRANSFORM].extendTexture(n, r), i.associations.set(n, o);
        }
      }
      return s !== void 0 && (n.colorSpace = s), e[t] = n, n;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   *
   * @private
   * @param {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(e) {
    const t = e.geometry;
    let a = e.material;
    const s = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, n = t.attributes.normal === void 0;
    if (e.isPoints) {
      const r = "PointsMaterial:" + a.uuid;
      let o = this.cache.get(r);
      o || (o = new ta(), Se.prototype.copy.call(o, a), o.color.copy(a.color), o.map = a.map, o.sizeAttenuation = !1, this.cache.add(r, o)), a = o;
    } else if (e.isLine) {
      const r = "LineBasicMaterial:" + a.uuid;
      let o = this.cache.get(r);
      o || (o = new aa(), Se.prototype.copy.call(o, a), o.color.copy(a.color), o.map = a.map, this.cache.add(r, o)), a = o;
    }
    if (s || i || n) {
      let r = "ClonedMaterial:" + a.uuid + ":";
      s && (r += "derivative-tangents:"), i && (r += "vertex-colors:"), n && (r += "flat-shading:");
      let o = this.cache.get(r);
      o || (o = a.clone(), i && (o.vertexColors = !0), n && (o.flatShading = !0), s && (o.normalScale && (o.normalScale.y *= -1), o.clearcoatNormalScale && (o.clearcoatNormalScale.y *= -1)), this.cache.add(r, o), this.associations.set(o, this.associations.get(a))), a = o;
    }
    e.material = a;
  }
  getMaterialType() {
    return ye;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   *
   * @private
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, a = this.json, s = this.extensions, i = a.materials[e];
    let n;
    const r = {}, o = i.extensions || {}, b = [];
    if (o[j.KHR_MATERIALS_UNLIT]) {
      const l = s[j.KHR_MATERIALS_UNLIT];
      n = l.getMaterialType(), b.push(l.extendParams(r, i, t));
    } else {
      const l = i.pbrMetallicRoughness || {};
      if (r.color = new ie(1, 1, 1), r.opacity = 1, Array.isArray(l.baseColorFactor)) {
        const d = l.baseColorFactor;
        r.color.setRGB(d[0], d[1], d[2], J), r.opacity = d[3];
      }
      l.baseColorTexture !== void 0 && b.push(t.assignTexture(r, "map", l.baseColorTexture, fe)), r.metalness = l.metallicFactor !== void 0 ? l.metallicFactor : 1, r.roughness = l.roughnessFactor !== void 0 ? l.roughnessFactor : 1, l.metallicRoughnessTexture !== void 0 && (b.push(t.assignTexture(r, "metalnessMap", l.metallicRoughnessTexture)), b.push(t.assignTexture(r, "roughnessMap", l.metallicRoughnessTexture))), n = this._invokeOne(function(d) {
        return d.getMaterialType && d.getMaterialType(e);
      }), b.push(Promise.all(this._invokeAll(function(d) {
        return d.extendMaterialParams && d.extendMaterialParams(e, r);
      })));
    }
    i.doubleSided === !0 && (r.side = sa);
    const h = i.alphaMode || ve.OPAQUE;
    if (h === ve.BLEND ? (r.transparent = !0, r.depthWrite = !1) : (r.transparent = !1, h === ve.MASK && (r.alphaTest = i.alphaCutoff !== void 0 ? i.alphaCutoff : 0.5)), i.normalTexture !== void 0 && n !== de && (b.push(t.assignTexture(r, "normalMap", i.normalTexture)), r.normalScale = new I(1, 1), i.normalTexture.scale !== void 0)) {
      const l = i.normalTexture.scale;
      r.normalScale.set(l, l);
    }
    if (i.occlusionTexture !== void 0 && n !== de && (b.push(t.assignTexture(r, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (r.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && n !== de) {
      const l = i.emissiveFactor;
      r.emissive = new ie().setRGB(l[0], l[1], l[2], J);
    }
    return i.emissiveTexture !== void 0 && n !== de && b.push(t.assignTexture(r, "emissiveMap", i.emissiveTexture, fe)), Promise.all(b).then(function() {
      const l = new n(r);
      return i.name && (l.name = i.name), W(l, i), t.associations.set(l, { materials: e }), i.extensions && ae(s, l, i), l;
    });
  }
  /**
   * When Object3D instances are targeted by animation, they need unique names.
   *
   * @private
   * @param {string} originalName
   * @return {string}
   */
  createUniqueName(e) {
    const t = ia.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @private
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(e) {
    const t = this, a = this.extensions, s = this.primitiveCache;
    function i(r) {
      return a[j.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(r, t).then(function(o) {
        return ot(o, r, t);
      });
    }
    const n = [];
    for (let r = 0, o = e.length; r < o; r++) {
      const b = e[r], h = ds(b), l = s[h];
      if (l)
        n.push(l.promise);
      else {
        let d;
        b.extensions && b.extensions[j.KHR_DRACO_MESH_COMPRESSION] ? d = i(b) : d = ot(new wt(), b, t), s[h] = { primitive: b, promise: d }, n.push(d);
      }
    }
    return Promise.all(n);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   *
   * @private
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh|Line|Points>}
   */
  loadMesh(e) {
    const t = this, a = this.json, s = this.extensions, i = a.meshes[e], n = i.primitives, r = [];
    for (let o = 0, b = n.length; o < b; o++) {
      const h = n[o].material === void 0 ? bs(this.cache) : this.getDependency("material", n[o].material);
      r.push(h);
    }
    return r.push(t.loadGeometries(n)), Promise.all(r).then(function(o) {
      const b = o.slice(0, o.length - 1), h = o[o.length - 1], l = [];
      for (let p = 0, E = h.length; p < E; p++) {
        const w = h[p], g = n[p];
        let f;
        const u = b[p];
        if (g.mode === B.TRIANGLES || g.mode === B.TRIANGLE_STRIP || g.mode === B.TRIANGLE_FAN || g.mode === void 0)
          f = i.isSkinnedMesh === !0 ? new na(w, u) : new ee(w, u), f.isSkinnedMesh === !0 && f.normalizeSkinWeights(), g.mode === B.TRIANGLE_STRIP ? f.geometry = tt(f.geometry, kt) : g.mode === B.TRIANGLE_FAN && (f.geometry = tt(f.geometry, Ge));
        else if (g.mode === B.LINES)
          f = new oa(w, u);
        else if (g.mode === B.LINE_STRIP)
          f = new ra(w, u);
        else if (g.mode === B.LINE_LOOP)
          f = new ca(w, u);
        else if (g.mode === B.POINTS)
          f = new ba(w, u);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + g.mode);
        Object.keys(f.geometry.morphAttributes).length > 0 && ls(f, i), f.name = t.createUniqueName(i.name || "mesh_" + e), W(f, i), g.extensions && ae(s, f, g), t.assignFinalMaterial(f), l.push(f);
      }
      for (let p = 0, E = l.length; p < E; p++)
        t.associations.set(l[p], {
          meshes: e,
          primitives: p
        });
      if (l.length === 1)
        return i.extensions && ae(s, l[0], i), l[0];
      const d = new Me();
      i.extensions && ae(s, d, i), t.associations.set(d, { meshes: e });
      for (let p = 0, E = l.length; p < E; p++)
        d.add(l[p]);
      return d;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   *
   * @private
   * @param {number} cameraIndex
   * @return {Promise<Camera>|undefined}
   */
  loadCamera(e) {
    let t;
    const a = this.json.cameras[e], s = a[a.type];
    if (!s) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return a.type === "perspective" ? t = new ha(mt.radToDeg(s.yfov), s.aspectRatio || 1, s.znear || 1, s.zfar || 2e6) : a.type === "orthographic" && (t = new la(-s.xmag, s.xmag, s.ymag, -s.ymag, s.znear, s.zfar)), a.name && (t.name = this.createUniqueName(a.name)), W(t, a), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   *
   * @private
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], a = [];
    for (let s = 0, i = t.joints.length; s < i; s++)
      a.push(this._loadNodeShallow(t.joints[s]));
    return t.inverseBindMatrices !== void 0 ? a.push(this.getDependency("accessor", t.inverseBindMatrices)) : a.push(null), Promise.all(a).then(function(s) {
      const i = s.pop(), n = s, r = [], o = [];
      for (let b = 0, h = n.length; b < h; b++) {
        const l = n[b];
        if (l) {
          r.push(l);
          const d = new Re();
          i !== null && d.fromArray(i.array, b * 16), o.push(d);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[b]);
      }
      return new da(r, o);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   *
   * @private
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const t = this.json, a = this, s = t.animations[e], i = s.name ? s.name : "animation_" + e, n = [], r = [], o = [], b = [], h = [];
    for (let l = 0, d = s.channels.length; l < d; l++) {
      const p = s.channels[l], E = s.samplers[p.sampler], w = p.target, g = w.node, f = s.parameters !== void 0 ? s.parameters[E.input] : E.input, u = s.parameters !== void 0 ? s.parameters[E.output] : E.output;
      w.node !== void 0 && (n.push(this.getDependency("node", g)), r.push(this.getDependency("accessor", f)), o.push(this.getDependency("accessor", u)), b.push(E), h.push(w));
    }
    return Promise.all([
      Promise.all(n),
      Promise.all(r),
      Promise.all(o),
      Promise.all(b),
      Promise.all(h)
    ]).then(function(l) {
      const d = l[0], p = l[1], E = l[2], w = l[3], g = l[4], f = [];
      for (let T = 0, k = d.length; T < k; T++) {
        const _ = d[T], A = p[T], v = E[T], y = w[T], M = g[T];
        if (_ === void 0) continue;
        _.updateMatrix && _.updateMatrix();
        const x = a._createAnimationTracks(_, A, v, y, M);
        if (x)
          for (let R = 0; R < x.length; R++)
            f.push(x[R]);
      }
      const u = new pa(i, void 0, f);
      return W(u, s), u;
    });
  }
  createNodeMesh(e) {
    const t = this.json, a = this, s = t.nodes[e];
    return s.mesh === void 0 ? null : a.getDependency("mesh", s.mesh).then(function(i) {
      const n = a._getNodeRef(a.meshCache, s.mesh, i);
      return s.weights !== void 0 && n.traverse(function(r) {
        if (r.isMesh)
          for (let o = 0, b = s.weights.length; o < b; o++)
            r.morphTargetInfluences[o] = s.weights[o];
      }), n;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   *
   * @private
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(e) {
    const t = this.json, a = this, s = t.nodes[e], i = a._loadNodeShallow(e), n = [], r = s.children || [];
    for (let b = 0, h = r.length; b < h; b++)
      n.push(a.getDependency("node", r[b]));
    const o = s.skin === void 0 ? Promise.resolve(null) : a.getDependency("skin", s.skin);
    return Promise.all([
      i,
      Promise.all(n),
      o
    ]).then(function(b) {
      const h = b[0], l = b[1], d = b[2];
      d !== null && h.traverse(function(p) {
        p.isSkinnedMesh && p.bind(d, fs);
      });
      for (let p = 0, E = l.length; p < E; p++)
        h.add(l[p]);
      if (h.userData.pivot !== void 0 && l.length > 0) {
        const p = h.userData.pivot, E = l[0];
        h.pivot = new G().fromArray(p), h.position.x -= p[0], h.position.y -= p[1], h.position.z -= p[2], E.position.set(0, 0, 0), delete h.userData.pivot;
      }
      return h;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, a = this.extensions, s = this;
    if (this.nodeCache[e] !== void 0)
      return this.nodeCache[e];
    const i = t.nodes[e], n = i.name ? s.createUniqueName(i.name) : "", r = [], o = s._invokeOne(function(b) {
      return b.createNodeMesh && b.createNodeMesh(e);
    });
    return o && r.push(o), i.camera !== void 0 && r.push(s.getDependency("camera", i.camera).then(function(b) {
      return s._getNodeRef(s.cameraCache, i.camera, b);
    })), s._invokeAll(function(b) {
      return b.createNodeAttachment && b.createNodeAttachment(e);
    }).forEach(function(b) {
      r.push(b);
    }), this.nodeCache[e] = Promise.all(r).then(function(b) {
      let h;
      if (i.isBone === !0 ? h = new fa() : b.length > 1 ? h = new Me() : b.length === 1 ? h = b[0] : h = new ze(), h !== b[0])
        for (let l = 0, d = b.length; l < d; l++)
          h.add(b[l]);
      if (i.name && (h.userData.name = i.name, h.name = n), W(h, i), i.extensions && ae(a, h, i), i.matrix !== void 0) {
        const l = new Re();
        l.fromArray(i.matrix), h.applyMatrix4(l);
      } else
        i.translation !== void 0 && h.position.fromArray(i.translation), i.rotation !== void 0 && h.quaternion.fromArray(i.rotation), i.scale !== void 0 && h.scale.fromArray(i.scale);
      if (!s.associations.has(h))
        s.associations.set(h, {});
      else if (i.mesh !== void 0 && s.meshCache.refs[i.mesh] > 1) {
        const l = s.associations.get(h);
        s.associations.set(h, { ...l });
      }
      return s.associations.get(h).nodes = e, h;
    }), this.nodeCache[e];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   *
   * @private
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(e) {
    const t = this.extensions, a = this.json.scenes[e], s = this, i = new Me();
    a.name && (i.name = s.createUniqueName(a.name)), W(i, a), a.extensions && ae(t, i, a);
    const n = a.nodes || [], r = [];
    for (let o = 0, b = n.length; o < b; o++)
      r.push(s.getDependency("node", n[o]));
    return Promise.all(r).then(function(o) {
      for (let h = 0, l = o.length; h < l; h++) {
        const d = o[h];
        d.parent !== null ? i.add(Ga(d)) : i.add(d);
      }
      const b = (h) => {
        const l = /* @__PURE__ */ new Map();
        for (const [d, p] of s.associations)
          (d instanceof Se || d instanceof We) && l.set(d, p);
        return h.traverse((d) => {
          const p = s.associations.get(d);
          p != null && l.set(d, p);
        }), l;
      };
      return s.associations = b(i), i;
    });
  }
  _createAnimationTracks(e, t, a, s, i) {
    const n = [], r = e.name ? e.name : e.uuid, o = [];
    $[i.path] === $.weights ? e.traverse(function(d) {
      d.morphTargetInfluences && o.push(d.name ? d.name : d.uuid);
    }) : o.push(r);
    let b;
    switch ($[i.path]) {
      case $.weights:
        b = Xe;
        break;
      case $.rotation:
        b = Ye;
        break;
      case $.translation:
      case $.scale:
        b = Je;
        break;
      default:
        switch (a.itemSize) {
          case 1:
            b = Xe;
            break;
          case 2:
          case 3:
          default:
            b = Je;
            break;
        }
        break;
    }
    const h = s.interpolation !== void 0 ? cs[s.interpolation] : _t, l = this._getArrayFromAccessor(a);
    for (let d = 0, p = o.length; d < p; d++) {
      const E = new b(
        o[d] + "." + $[i.path],
        t.array,
        l,
        h
      );
      s.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(E), n.push(E);
    }
    return n;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const a = Ke(t.constructor), s = new Float32Array(t.length);
      for (let i = 0, n = t.length; i < n; i++)
        s[i] = t[i] * a;
      t = s;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(a) {
      const s = this instanceof Ye ? rs : Dt;
      return new s(this.times, this.values, this.getValueSize() / 3, a);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
}
function ms(c, e, t) {
  const a = e.attributes, s = new xa();
  if (a.POSITION !== void 0) {
    const r = t.json.accessors[a.POSITION], o = r.min, b = r.max;
    if (o !== void 0 && b !== void 0) {
      if (s.set(
        new G(o[0], o[1], o[2]),
        new G(b[0], b[1], b[2])
      ), r.normalized) {
        const h = Ke(be[r.componentType]);
        s.min.multiplyScalar(h), s.max.multiplyScalar(h);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const i = e.targets;
  if (i !== void 0) {
    const r = new G(), o = new G();
    for (let b = 0, h = i.length; b < h; b++) {
      const l = i[b];
      if (l.POSITION !== void 0) {
        const d = t.json.accessors[l.POSITION], p = d.min, E = d.max;
        if (p !== void 0 && E !== void 0) {
          if (o.setX(Math.max(Math.abs(p[0]), Math.abs(E[0]))), o.setY(Math.max(Math.abs(p[1]), Math.abs(E[1]))), o.setZ(Math.max(Math.abs(p[2]), Math.abs(E[2]))), d.normalized) {
            const w = Ke(be[d.componentType]);
            o.multiplyScalar(w);
          }
          r.max(o);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    s.expandByVector(r);
  }
  c.boundingBox = s;
  const n = new Ea();
  s.getCenter(n.center), n.radius = s.min.distanceTo(s.max) / 2, c.boundingSphere = n;
}
function ot(c, e, t) {
  const a = e.attributes, s = [];
  function i(n, r) {
    return t.getDependency("accessor", n).then(function(o) {
      c.setAttribute(r, o);
    });
  }
  for (const n in a) {
    const r = Ne[n] || n.toLowerCase();
    r in c.attributes || s.push(i(a[n], r));
  }
  if (e.indices !== void 0 && !c.index) {
    const n = t.getDependency("accessor", e.indices).then(function(r) {
      c.setIndex(r);
    });
    s.push(n);
  }
  return Ze.workingColorSpace !== J && "COLOR_0" in a && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ze.workingColorSpace}" not supported.`), W(c, e), ms(c, e, t), Promise.all(s).then(function() {
    return e.targets !== void 0 ? hs(c, e.targets, t) : c;
  });
}
class gs extends wa {
  /**
      * Constructs a new RGBE/HDR loader.
      *
      * @param {LoadingManager} [manager] - The loading manager.
      */
  constructor(e) {
    super(e), this.type = me;
  }
  /**
      * Parses the given RGBE texture data.
      *
      * @param {ArrayBuffer} buffer - The raw texture data.
      * @return {DataTextureLoader~TexData} An object representing the parsed texture data.
      */
  parse(e) {
    const n = function(y, M) {
      switch (y) {
        case 1:
          throw new Error("THREE.HDRLoader: Read Error: " + (M || ""));
        case 2:
          throw new Error("THREE.HDRLoader: Write Error: " + (M || ""));
        case 3:
          throw new Error("THREE.HDRLoader: Bad File Format: " + (M || ""));
        default:
        case 4:
          throw new Error("THREE.HDRLoader: Memory Error: " + (M || ""));
      }
    }, l = function(y, M, x) {
      M = M || 1024;
      let O = y.pos, D = -1, S = 0, P = "", F = String.fromCharCode.apply(null, new Uint16Array(y.subarray(O, O + 128)));
      for (; 0 > (D = F.indexOf(`
`)) && S < M && O < y.byteLength; )
        P += F, S += F.length, O += 128, F += String.fromCharCode.apply(null, new Uint16Array(y.subarray(O, O + 128)));
      return -1 < D ? (y.pos += S + D + 1, P + F.slice(0, D)) : !1;
    }, d = function(y) {
      const M = /^#\?(\S+)/, x = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/, R = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/, O = /^\s*FORMAT=(\S+)\s*$/, D = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/, S = {
        valid: 0,
        /* indicate which fields are valid */
        string: "",
        /* the actual header string */
        comments: "",
        /* comments found in header */
        programtype: "RGBE",
        /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */
        format: "",
        /* RGBE format, default 32-bit_rle_rgbe */
        gamma: 1,
        /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */
        exposure: 1,
        /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */
        width: 0,
        height: 0
        /* image dimensions, width/height */
      };
      let P, F;
      for ((y.pos >= y.byteLength || !(P = l(y))) && n(1, "no header found"), (F = P.match(M)) || n(3, "bad initial token"), S.valid |= 1, S.programtype = F[1], S.string += P + `
`; P = l(y), P !== !1; ) {
        if (S.string += P + `
`, P.charAt(0) === "#") {
          S.comments += P + `
`;
          continue;
        }
        if ((F = P.match(x)) && (S.gamma = parseFloat(F[1])), (F = P.match(R)) && (S.exposure = parseFloat(F[1])), (F = P.match(O)) && (S.valid |= 2, S.format = F[1]), (F = P.match(D)) && (S.valid |= 4, S.height = parseInt(F[1], 10), S.width = parseInt(F[2], 10)), S.valid & 2 && S.valid & 4) break;
      }
      return S.valid & 2 || n(3, "missing format specifier"), S.valid & 4 || n(3, "missing image size specifier"), S;
    }, p = function(y, M, x) {
      const R = M;
      if (
        // run length encoding is not allowed so read flat
        R < 8 || R > 32767 || // this file is not run length encoded
        y[0] !== 2 || y[1] !== 2 || y[2] & 128
      )
        return new Uint8Array(y);
      R !== (y[2] << 8 | y[3]) && n(3, "wrong scanline width");
      const O = new Uint8Array(4 * M * x);
      O.length || n(4, "unable to allocate buffer space");
      let D = 0, S = 0;
      const P = 4 * R, F = new Uint8Array(4), H = new Uint8Array(P);
      let V = x;
      for (; V > 0 && S < y.byteLength; ) {
        S + 4 > y.byteLength && n(1), F[0] = y[S++], F[1] = y[S++], F[2] = y[S++], F[3] = y[S++], (F[0] != 2 || F[1] != 2 || (F[2] << 8 | F[3]) != R) && n(3, "bad rgbe scanline format");
        let C = 0, K;
        for (; C < P && S < y.byteLength; ) {
          K = y[S++];
          const Y = K > 128;
          if (Y && (K -= 128), (K === 0 || C + K > P) && n(3, "bad scanline data"), Y) {
            const Z = y[S++];
            for (let Be = 0; Be < K; Be++)
              H[C++] = Z;
          } else
            H.set(y.subarray(S, S + K), C), C += K, S += K;
        }
        const Lt = R;
        for (let Y = 0; Y < Lt; Y++) {
          let Z = 0;
          O[D] = H[Y + Z], Z += R, O[D + 1] = H[Y + Z], Z += R, O[D + 2] = H[Y + Z], Z += R, O[D + 3] = H[Y + Z], D += 4;
        }
        V--;
      }
      return O;
    }, E = function(y, M, x, R) {
      const O = y[M + 3], D = Math.pow(2, O - 128) / 255;
      x[R + 0] = y[M + 0] * D, x[R + 1] = y[M + 1] * D, x[R + 2] = y[M + 2] * D, x[R + 3] = 1;
    }, w = function(y, M, x, R) {
      const O = y[M + 3], D = Math.pow(2, O - 128) / 255;
      x[R + 0] = ge.toHalfFloat(Math.min(y[M + 0] * D, 65504)), x[R + 1] = ge.toHalfFloat(Math.min(y[M + 1] * D, 65504)), x[R + 2] = ge.toHalfFloat(Math.min(y[M + 2] * D, 65504)), x[R + 3] = ge.toHalfFloat(1);
    }, g = new Uint8Array(e);
    g.pos = 0;
    const f = d(g), u = f.width, T = f.height, k = p(g.subarray(g.pos), u, T);
    let _, A, v;
    switch (this.type) {
      case je:
        v = k.length / 4;
        const y = new Float32Array(v * 4);
        for (let x = 0; x < v; x++)
          E(k, x * 4, y, x * 4);
        _ = y, A = je;
        break;
      case me:
        v = k.length / 4;
        const M = new Uint16Array(v * 4);
        for (let x = 0; x < v; x++)
          w(k, x * 4, M, x * 4);
        _ = M, A = me;
        break;
      default:
        throw new Error("THREE.HDRLoader: Unsupported type: " + this.type);
    }
    return {
      width: u,
      height: T,
      data: _,
      header: f.string,
      gamma: f.gamma,
      exposure: f.exposure,
      type: A
    };
  }
  /**
      * Sets the texture type.
      *
      * @param {(HalfFloatType|FloatType)} value - The texture type to set.
      * @return {HDRLoader} A reference to this loader.
      */
  setDataType(e) {
    return this.type = e, this;
  }
  load(e, t, a, s) {
    function i(n, r) {
      switch (n.type) {
        case je:
        case me:
          n.colorSpace = J, n.minFilter = ue, n.magFilter = ue, n.generateMipmaps = !1, n.flipY = !0;
          break;
      }
      t && t(n, r);
    }
    return super.load(e, i, a, s);
  }
}
var xs = (function() {
  var c = "b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuec:W:Odkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq;lZkdbk;jYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbhodnawTmbaxa8Acd4fRbbhokaocFeGh5cbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q1jjbfcj1jjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bbarcwf9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfag9c8F1:NghcKtc8F91aicdfa8J9c8N1:Nfg8KRbbG86bbarcVfcba8KahcjeGcr4fghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fag9c8F1:NgicKtc8F91aha8J9c8N1:NfghRbbG86bbarc96fcbahaicjeGcr4fgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbb83bbarcwfaicwf8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbcbaocl49Rh8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E93aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:XseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbaxcefgOavaiaqaDcsGfRbbgscl49RcsGcdtfydbascz6gPEhDavaias9RcsGcdtfydbaOaPfgzascsGgOEhsaOThOdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiaPfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaOfhiazaOfhxxekaxcbalRbbgHEgAaDc;:eSgDfhzaHcsGhCaHcl4hXdndnaHcs0mbazcefhOxekazhOavaiaX9RcsGcdtfydbhzkdndnaCmbaOcefhxxekaOhxavaiaH9RcsGcdtfydbhOkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhAascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaAhDxekaDcefhDkasce4cbasceG9R7amfgmhAkdndnaXcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhzaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkazhsxekascefhskaPce4cbaPceG9R7amfgmhzkdndnaCcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhOaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkaOhlxekalcefhlkaPce4cbaPceG9R7amfgmhOkdndnadcd9hmbabarcetfgDaA87ebaDclfaO87ebaDcdfaz87ebxekabarcdtfgDaABdbaDcwfaOBdbaDclfazBdbkavc;abfaocitfgDazBdbaDaABdlavaicdtfaABdbavc;abfaocefcsGcitfgDaOBdbaDazBdlavaicefgicsGcdtfazBdbavc;abfaocdfcsGcitfgDaABdbaDaOBdlavaiaHcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnaecvfal9nmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk::ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxabaiarcefciGfcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGfgkcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkabaiarcufciGfcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkabakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K1jjbgeabcifc98GfgbBd:K1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;teeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiaeydlBdlaiaeydwBdwaiaeydxBdxaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk:3eedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdxaialBdwaialBdlaialBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk81dbcjwk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:Kwkl8WNbb", e = "b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuec:q:6dkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:Ctklbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:183lYud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxavaialfgmar9Rgoad;8qbbcj;abad9Uc;WFbGcjdadca0EhPdndndnadTmbaoadfhscbhzinaeaz9nmdamax9RaD6miabazad2fhHaxaDfhOaPaeaz9RazaPfae6EgAcsfgocl4cifcd4hCavcj;cbfaoc9WGgXcetfhQavcj;cbfaXci2fhLavcj;cbfaXfhKcbhYaoc;ab6h8AincbhodnawTmbaxaYcd4fRbbhokaocFeGhEcbh3avcj;cbfh5indndndndnaEa3cet4ciGgoc9:fPdebdkamaO9RaX6mwavcj;cbfa3aX2faOaX;8qbbaOaAfhOxdkavcj;cbfa3aX2fcbaX;8kbxekamaO9RaC6moaoclVcbawEhraOaCfhocbhidna8Ambamao9Rc;Gb6mbcbhlina5alfhidndndndndndnaOalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLg8Ecdp:mea8EpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9og8Fpxiiiiiiiiiiiiiiiip8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaaaoclffahc:q:yjjbfRbbfhoxikaiaopbbwaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9og8Fpxssssssssssssssssp8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaaaocwffahc:q:yjjbfRbbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbgacitc:q1jjbfpbibaac:q:yjjbfRbbgapsaoRbeghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPpklbaaaocdffahc:q:yjjbfRbbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLg8Ecdp:mea8EpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9og8Fpxiiiiiiiiiiiiiiiip8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaaaoclffahc:q:yjjbfRbbfhoxikaiczfaopbbwaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9og8Fpxssssssssssssssssp8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaaaocwffahc:q:yjjbfRbbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbgacitc:q1jjbfpbibaac:q:yjjbfRbbgapsaoRbeghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPpklbaaaocdffahc:q:yjjbfRbbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLg8Ecdp:mea8EpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9og8Fpxiiiiiiiiiiiiiiiip8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaaaoclffahc:q:yjjbfRbbfhoxikaicafaopbbwaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9og8Fpxssssssssssssssssp8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaaaocwffahc:q:yjjbfRbbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbgacitc:q1jjbfpbibaac:q:yjjbfRbbgapsaoRbeghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPpklbaaaocdffahc:q:yjjbfRbbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLg8Ecdp:mea8EpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9og8Fpxiiiiiiiiiiiiiiiip8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngicitc:q1jjbfpbibaic:q:yjjbfRbbgipsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaiaoclffaqc:q:yjjbfRbbfhoxikaic8Wfaopbbwaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9og8Fpxssssssssssssssssp8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngicitc:q1jjbfpbibaic:q:yjjbfRbbgipsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spklbaiaocwffaqc:q:yjjbfRbbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitc:q1jjbfpbibaic:q:yjjbfRbbgipsaoRbegqcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqc:q:yjjbfRbbfhokalc;abfhialcjefaX0meaihlamao9Rc;Fb0mbkkdnaiaX9pmbaici4hlinamao9RcK6mwa5aifhqdndndndndndnaOaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLg8Ecdp:mea8EpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9og8Fpxiiiiiiiiiiiiiiiip8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spkbbaaaoclffahc:q:yjjbfRbbfhoxikaqaopbbwaopbbbg8Eclp:mea8EpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9og8Fpxssssssssssssssssp8Jg8Ep5b9cjF;8;4;W;G;ab9:9cU1:Ngacitc:q1jjbfpbibaac:q:yjjbfRbbgapsa8Ep5e9cjF;8;4;W;G;ab9:9cU1:Nghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPa8Fa8Ep9spkbbaaaocwffahc:q:yjjbfRbbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbgacitc:q1jjbfpbibaac:q:yjjbfRbbgapsaoRbeghcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPpkbbaaaocdffahc:q:yjjbfRbbfhokalcdfhlaiczfgiaX6mbkkaohOaoTmoka5aXfh5a3cefg3cl9hmbkdndndndnawTmbasaYcd4fRbbglciGPlbedwbkaXTmdavcjdfaYfhlavaYfpbdbhgcbhoinalavcj;cbfaofpblbg8JaKaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaQaofpblbg8MaLaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Ecep9Ta8Epxeeeeeeeeeeeeeeeeg8Fp9op9Hp9rg8Eagp9Uggp9Abbbaladfglaga8Ea8Epmlvorlvorlvorlvorp9Uggp9Abbbaladfglaga8Ea8EpmwDqkwDqkwDqkwDqkp9Uggp9Abbbaladfglaga8Ea8EpmxmPsxmPsxmPsxmPsp9Uggp9Abbbaladfglaga8LaypmwDKYqk8AExm35Ps8E8Fg8Ecep9Ta8Ea8Fp9op9Hp9rg8Ep9Uggp9Abbbaladfglaga8Ea8Epmlvorlvorlvorlvorp9Uggp9Abbbaladfglaga8Ea8EpmwDqkwDqkwDqkwDqkp9Uggp9Abbbaladfglaga8Ea8EpmxmPsxmPsxmPsxmPsp9Uggp9Abbbaladfglaga8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Ecep9Ta8Ea8Fp9op9Hp9rg8Ep9Uggp9Abbbaladfglaga8Ea8Epmlvorlvorlvorlvorp9Uggp9Abbbaladfglaga8Ea8EpmwDqkwDqkwDqkwDqkp9Uggp9Abbbaladfglaga8Ea8EpmxmPsxmPsxmPsxmPsp9Uggp9Abbbaladfglaga8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Ecep9Ta8Ea8Fp9op9Hp9rg8Ep9Ug8Fp9Abbbaladfgla8Fa8Ea8Epmlvorlvorlvorlvorp9Ug8Fp9Abbbaladfgla8Fa8Ea8EpmwDqkwDqkwDqkwDqkp9Ug8Fp9Abbbaladfgla8Fa8Ea8EpmxmPsxmPsxmPsxmPsp9Uggp9AbbbaladfhlaoczfgoaX6mbxikkaXTmeavcjdfaYfhlavaYfpbdbhgcbhoinalavcj;cbfaofpblbg8JaKaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaQaofpblbg8MaLaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Ecep:nea8Epxebebebebebebebebg8Fp9op:bep9rg8Eagp:oeggp9Abbbaladfglaga8Ea8Epmlvorlvorlvorlvorp:oeggp9Abbbaladfglaga8Ea8EpmwDqkwDqkwDqkwDqkp:oeggp9Abbbaladfglaga8Ea8EpmxmPsxmPsxmPsxmPsp:oeggp9Abbbaladfglaga8LaypmwDKYqk8AExm35Ps8E8Fg8Ecep:nea8Ea8Fp9op:bep9rg8Ep:oeggp9Abbbaladfglaga8Ea8Epmlvorlvorlvorlvorp:oeggp9Abbbaladfglaga8Ea8EpmwDqkwDqkwDqkwDqkp:oeggp9Abbbaladfglaga8Ea8EpmxmPsxmPsxmPsxmPsp:oeggp9Abbbaladfglaga8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Ecep:nea8Ea8Fp9op:bep9rg8Ep:oeggp9Abbbaladfglaga8Ea8Epmlvorlvorlvorlvorp:oeggp9Abbbaladfglaga8Ea8EpmwDqkwDqkwDqkwDqkp:oeggp9Abbbaladfglaga8Ea8EpmxmPsxmPsxmPsxmPsp:oeggp9Abbbaladfglaga8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Ecep:nea8Ea8Fp9op:bep9rg8Ep:oeg8Fp9Abbbaladfgla8Fa8Ea8Epmlvorlvorlvorlvorp:oeg8Fp9Abbbaladfgla8Fa8Ea8EpmwDqkwDqkwDqkwDqkp:oeg8Fp9Abbbaladfgla8Fa8Ea8EpmxmPsxmPsxmPsxmPsp:oeggp9AbbbaladfhlaoczfgoaX6mbxdkkaXTmbcbhocbalcl4gl9Rc8FGhiavcjdfaYfhravaYfpbdbh8Finaravcj;cbfaofpblbggaKaofpblbg8JpmbzeHdOiAlCvXoQrLg8KaQaofpblbg8LaLaofpblbg8MpmbzeHdOiAlCvXoQrLg8NpmbezHdiOAlvCXorQLg8Eaip:Rea8Ealp:Sep9qg8Ea8Fp9rg8Fp9Abbbaradfgra8Fa8Ea8Epmlvorlvorlvorlvorp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmwDqkwDqkwDqkwDqkp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmxmPsxmPsxmPsxmPsp9rg8Fp9Abbbaradfgra8Fa8Ka8NpmwDKYqk8AExm35Ps8E8Fg8Eaip:Rea8Ealp:Sep9qg8Ep9rg8Fp9Abbbaradfgra8Fa8Ea8Epmlvorlvorlvorlvorp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmwDqkwDqkwDqkwDqkp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmxmPsxmPsxmPsxmPsp9rg8Fp9Abbbaradfgra8Faga8JpmwKDYq8AkEx3m5P8Es8Fgga8La8MpmwKDYq8AkEx3m5P8Es8Fg8JpmbezHdiOAlvCXorQLg8Eaip:Rea8Ealp:Sep9qg8Ep9rg8Fp9Abbbaradfgra8Fa8Ea8Epmlvorlvorlvorlvorp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmwDqkwDqkwDqkwDqkp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmxmPsxmPsxmPsxmPsp9rg8Fp9Abbbaradfgra8Faga8JpmwDKYqk8AExm35Ps8E8Fg8Eaip:Rea8Ealp:Sep9qg8Ep9rg8Fp9Abbbaradfgra8Fa8Ea8Epmlvorlvorlvorlvorp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmwDqkwDqkwDqkwDqkp9rg8Fp9Abbbaradfgra8Fa8Ea8EpmxmPsxmPsxmPsxmPsp9rg8Fp9AbbbaradfhraoczfgoaX6mbkkaYclfgYad6mbkaHavcjdfaAad2;8qbbavavcjdfaAcufad2fad;8qbbaAazfhzc9:hoaOhxaOmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdaPaeao9RaoaPfae6Eaofgoae6mbkaial9Rhxkcbc99amax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbk:TseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbaxcefgOavaiaqaDcsGfRbbgscl49RcsGcdtfydbascz6gPEhDavaias9RcsGcdtfydbaOaPfgzascsGgOEhsaOThOdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiaPfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaOfhiazaOfhxxekaxcbalRbbgHEgAaDc;:eSgDfhzaHcsGhCaHcl4hXdndnaHcs0mbazcefhOxekazhOavaiaX9RcsGcdtfydbhzkdndnaCmbaOcefhxxekaOhxavaiaH9RcsGcdtfydbhOkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhAascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaAhDxekaDcefhDkasce4cbasceG9R7amfgmhAkdndnaXcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhzaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkazhsxekascefhskaPce4cbaPceG9R7amfgmhzkdndnaCcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhOaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkaOhlxekalcefhlkaPce4cbaPceG9R7amfgmhOkdndnadcd9hmbabarcetfgDaA87ebaDclfaO87ebaDcdfaz87ebxekabarcdtfgDaABdbaDcwfaOBdbaDclfazBdbkavc;abfaocitfgDazBdbaDaABdlavaicdtfaABdbavc;abfaocefcsGcitfgDaOBdbaDazBdlavaicefgicsGcdtfazBdbavc;abfaocdfcsGcitfgDaABdbaDaOBdlavaiaHcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnaecvfal9nmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:2Pliur97eue978Jjjjjbc8W9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskaipxFubbFubbFubbFubbgxpklbdnalTmbcbhvabhdinadczfgmampbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraipblbaDaopmlvorxmPsCXQL358E8Fp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgPp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;MeawaqawaPp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiczfpxbbbbbbbbbbbbbbbbgopklbaiaopklbaiabalcitfgdaeciGglcitgv;8qbbaiaxpkladnalTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraipblaaDaopmlvorxmPsCXQL358E8Fp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgPp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;MeawaqawaPp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkadaiav;8qbbkk:Iwllue97euo978Jjjjjbca9Rhidnaec98GglTmbcbhvabhoinaocKfpx:ji:1S:ji:1S:ji:1S:ji:1SaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkpxibbbibbbibbbibbbp9qgxp;6ep;Negmaxaxp:1ep;7egxaxp;KearaDpmbediwDqkzHOAKY8AEgxczp:Reczp:Sep;6egrarp;Meaxczp:Sep;6egDaDp;Meaqczp:Reczp:Sep;6egqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gxp;KepxFFbbFFbbFFbbFFbbgPp9oamaDp;Meaxp;Keczp:Rep9qgDamarp;Meaxp;KeaPp9oamaqp;Meaxp;Keczp:Rep9qgxpmwDKYqk8AExm35Ps8E8Fgrp5eakclp:RegmpEi:T:j83ibawarp5bampEd:T:j83ibaocwfaDaxpmbezHdiOAlvCXorQLgxp5eampEe:T:j83ibaoaxp5bampEb:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiczfpxbbbbbbbbbbbbbbbbgmpklbaiampklbaiabalcitfgoaeciGgvcitgw;8qbbdnavTmbaipx:ji:1S:ji:1S:ji:1S:ji:1SaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkpxibbbibbbibbbibbbp9qgxp;6ep;Negmaxaxp:1ep;7egxaxp;KearaDpmbediwDqkzHOAKY8AEgxczp:Reczp:Sep;6egrarp;Meaxczp:Sep;6egDaDp;Meaqczp:Reczp:Sep;6egqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gxp;KepxFFbbFFbbFFbbFFbbgPp9oamaDp;Meaxp;Keczp:Rep9qgDamarp;Meaxp;KeaPp9oamaqp;Meaxp;Keczp:Rep9qgxpmwDKYqk8AExm35Ps8E8Fgrp5eakclp:RegmpEi:T:j83iKaiarp5bampEd:T:j83izaiaDaxpmbezHdiOAlvCXorQLgxp5eampEe:T:j83iwaiaxp5bampEb:T:j83ibkaoaiaw;8qbbkk;uddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaic8WfpxbbbbbbbbbbbbbbbbgopklbaicafaopklbaiczfaopklbaiaopklbaiabavcdtfgdalciGgecdtgv;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkadaiav;8qbbkk:CPvdue97euw97eu8Jjjjjbc8W9Rhiaec98Ghldndnadcl9hmbaipxbbbbbbbbbbbbbbbbgvpklbdnalTmbcbhoabhdinadpbbbhradpxbbuJbbuJbbuJbbuJaipblbarcKp:Tep9qgwcep:Seawp9qgDcdp:SeaDp9qgDclp:SeaDp9qgqp;6ep;NegDarcwp:RecKp:SegkarpxFbbbFbbbFbbbFbbbgxp9ogmp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gPp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oaDamakp:Xearczp:RecKp:Segrp:Uep;6ep;MeaPp;Keaxp9op9qaDamakarp:Uep:Xep;6ep;MeaPp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qaDaqawcep:Rep9oawpxebbbebbbebbbebbbp9op9qp;6ep;MeaPp;KecKp:Rep9qpkbbadczfhdaoclfgoal6mbkkalaeSmeaiavpklaaicafabalcdtfgdaeciGglcdtgo;8qbbaiavpklbdnalTmbaipblahraipxbbuJbbuJbbuJbbuJaipblbarcKp:Tep9qgwcep:Seawp9qgDcdp:SeaDp9qgDclp:SeaDp9qgqp;6ep;NegDarcwp:RecKp:SegkarpxFbbbFbbbFbbbFbbbgxp9ogmp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gPp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oaDamakp:Xearczp:RecKp:Segrp:Uep;6ep;MeaPp;Keaxp9op9qaDamakarp:Uep:Xep;6ep;MeaPp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qaDaqawcep:Rep9oawpxebbbebbbebbbebbbp9op9qp;6ep;MeaPp;KecKp:Rep9qpklakadaicafao;8qbbskaipxbbbbbbbbbbbbbbbbgvpklbdnalTmbcbhoabhdinadczfgspxbFu9hbFu9hbFu9hbFu9hadpbbbgDaspbbbgPpmlvorxmPsCXQL358E8Fgmczp:Teaipblbp9qgrcep:Searp9qgwcdp:Seawp9qgwclp:Seawp9qgwcwp:Seawp9qgqp;6ep;NegwaDaPpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbgPp9ogkaDczp:Segxp:Ueamczp:Reczp:Segmp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gDp;KeaPp9oawakaxamp:Uep:Xep;6ep;MeaDp;Keczp:Rep9qgxawaqarcep:Rep9oarpxebbbebbbebbbebbbp9op9qp;6ep;MeaDp;Keczp:Reawamakp:Uep;6ep;MeaDp;KeaPp9op9qgrpmwDKYqk8AExm35Ps8E8FpkbbadaxarpmbezHdiOAlvCXorQLpkbbadcafhdaoclfgoal6mbkkalaeSmbaiczfpxbbbbbbbbbbbbbbbbgrpklbaiarpklbaiabalcitfgdaeciGglcitgo;8qbbaiavpkladnalTmbaipxbFu9hbFu9hbFu9hbFu9haipblbgDaipblzgPpmlvorxmPsCXQL358E8Fgmczp:Teaipblap9qgrcep:Searp9qgwcdp:Seawp9qgwclp:Seawp9qgwcwp:Seawp9qgqp;6ep;NegwaDaPpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbgPp9ogkaDczp:Segxp:Ueamczp:Reczp:Segmp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gDp;KeaPp9oawakaxamp:Uep:Xep;6ep;MeaDp;Keczp:Rep9qgxawaqarcep:Rep9oarpxebbbebbbebbbebbbp9op9qp;6ep;MeaDp;Keczp:Reawamakp:Uep;6ep;MeaDp;KeaPp9op9qgrpmwDKYqk8AExm35Ps8E8FpklzaiaxarpmbezHdiOAlvCXorQLpklbkadaiao;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb", t = new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    4,
    1,
    96,
    0,
    0,
    3,
    3,
    2,
    0,
    0,
    5,
    3,
    1,
    0,
    1,
    12,
    1,
    0,
    10,
    22,
    2,
    12,
    0,
    65,
    0,
    65,
    0,
    65,
    0,
    252,
    10,
    0,
    0,
    11,
    7,
    0,
    65,
    0,
    253,
    15,
    26,
    11
  ]), a = new Uint8Array([
    32,
    0,
    65,
    2,
    1,
    106,
    34,
    33,
    3,
    128,
    11,
    4,
    13,
    64,
    6,
    253,
    10,
    7,
    15,
    116,
    127,
    5,
    8,
    12,
    40,
    16,
    19,
    54,
    20,
    9,
    27,
    255,
    113,
    17,
    42,
    67,
    24,
    23,
    146,
    148,
    18,
    14,
    22,
    45,
    70,
    69,
    56,
    114,
    101,
    21,
    25,
    63,
    75,
    136,
    108,
    28,
    118,
    29,
    73,
    115
  ]);
  if (typeof WebAssembly != "object")
    return {
      supported: !1
    };
  var s = WebAssembly.validate(t) ? r(e) : r(c), i, n = WebAssembly.instantiate(s, {}).then(function(f) {
    i = f.instance, i.exports.__wasm_call_ctors();
  });
  function r(f) {
    for (var u = new Uint8Array(f.length), T = 0; T < f.length; ++T) {
      var k = f.charCodeAt(T);
      u[T] = k > 96 ? k - 97 : k > 64 ? k - 39 : k + 4;
    }
    for (var _ = 0, T = 0; T < f.length; ++T)
      u[_++] = u[T] < 60 ? a[u[T]] : (u[T] - 60) * 64 + u[++T];
    return u.buffer.slice(0, _);
  }
  function o(f, u, T, k, _, A, v) {
    var y = f.exports.sbrk, M = k + 3 & -4, x = y(M * _), R = y(A.length), O = new Uint8Array(f.exports.memory.buffer);
    O.set(A, R);
    var D = u(x, k, _, R, A.length);
    if (D == 0 && v && v(x, M, _), T.set(O.subarray(x, x + k * _)), y(x - y(0)), D != 0)
      throw new Error("Malformed buffer data: " + D);
  }
  var b = {
    NONE: "",
    OCTAHEDRAL: "meshopt_decodeFilterOct",
    QUATERNION: "meshopt_decodeFilterQuat",
    EXPONENTIAL: "meshopt_decodeFilterExp",
    COLOR: "meshopt_decodeFilterColor"
  }, h = {
    ATTRIBUTES: "meshopt_decodeVertexBuffer",
    TRIANGLES: "meshopt_decodeIndexBuffer",
    INDICES: "meshopt_decodeIndexSequence"
  }, l = [], d = 0;
  function p(f) {
    var u = {
      object: new Worker(f),
      pending: 0,
      requests: {}
    };
    return u.object.onmessage = function(T) {
      var k = T.data;
      u.pending -= k.count, u.requests[k.id][k.action](k.value), delete u.requests[k.id];
    }, u;
  }
  function E(f) {
    for (var u = "self.ready = WebAssembly.instantiate(new Uint8Array([" + new Uint8Array(s) + "]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = " + g.name + ";" + o.toString() + g.toString(), T = new Blob([u], { type: "text/javascript" }), k = URL.createObjectURL(T), _ = l.length; _ < f; ++_)
      l[_] = p(k);
    for (var _ = f; _ < l.length; ++_)
      l[_].object.postMessage({});
    l.length = f, URL.revokeObjectURL(k);
  }
  function w(f, u, T, k, _) {
    for (var A = l[0], v = 1; v < l.length; ++v)
      l[v].pending < A.pending && (A = l[v]);
    return new Promise(function(y, M) {
      var x = new Uint8Array(T), R = ++d;
      A.pending += f, A.requests[R] = { resolve: y, reject: M }, A.object.postMessage({ id: R, count: f, size: u, source: x, mode: k, filter: _ }, [x.buffer]);
    });
  }
  function g(f) {
    var u = f.data;
    if (!u.id)
      return self.close();
    self.ready.then(function(T) {
      try {
        var k = new Uint8Array(u.count * u.size);
        o(T, T.exports[u.mode], k, u.count, u.size, u.source, T.exports[u.filter]), self.postMessage({ id: u.id, count: u.count, action: "resolve", value: k }, [k.buffer]);
      } catch (_) {
        self.postMessage({ id: u.id, count: u.count, action: "reject", value: _ });
      }
    });
  }
  return {
    ready: n,
    supported: !0,
    useWorkers: function(f) {
      E(f);
    },
    decodeVertexBuffer: function(f, u, T, k, _) {
      o(i, i.exports.meshopt_decodeVertexBuffer, f, u, T, k, i.exports[b[_]]);
    },
    decodeIndexBuffer: function(f, u, T, k) {
      o(i, i.exports.meshopt_decodeIndexBuffer, f, u, T, k);
    },
    decodeIndexSequence: function(f, u, T, k) {
      o(i, i.exports.meshopt_decodeIndexSequence, f, u, T, k);
    },
    decodeGltfBuffer: function(f, u, T, k, _, A) {
      o(i, i.exports[h[_]], f, u, T, k, i.exports[b[A]]);
    },
    decodeGltfBufferAsync: function(f, u, T, k, _) {
      return l.length > 0 ? w(f, u, T, h[k], b[_]) : n.then(function() {
        var A = new Uint8Array(f * u);
        return o(i, i.exports[h[k]], A, f, u, T, i.exports[b[_]]), A;
      });
    }
  };
})();
const vt = 0.0254, Ie = (c, e = 2) => Number(c.toFixed(e)), Es = { min: 2.15, max: 3.35, step: 0.05 }, ws = { min: 2, max: 7, step: 0.05 }, ks = { min: 2.25, max: 6.5, step: 0.05 }, Ts = Ie(177.1875 * vt, 3), ys = Ie(168 * vt, 3), Ft = 75, Pt = (c) => c <= 10 * 0.3048 + 0.05 ? 3 : 4, _e = [
  { id: "ral7016", code: "RAL 7016", hex: "#383E42" },
  { id: "ral9005", code: "RAL 9005", hex: "#1B1C1E" },
  { id: "ral9016", code: "RAL 9016", hex: "#E7E7E2" },
  { id: "ral9006", code: "RAL 9006", hex: "#A5A5A5" },
  { id: "ral8019", code: "RAL 8019", hex: "#3F3A3A" },
  { id: "ral1015", code: "RAL 1015", hex: "#E6D2B5" }
], Rs = ["match", ..._e.map((c) => c.id)], Ee = ["none", "sliding", "fixed", "zip", "panel"], _s = ["front", "right", "rear", "left"], Ss = ["off", "warm", "color"], Ms = ["studio", "patio", "pool", "deck", "rooftop"], js = ["day", "night"], Pe = Object.freeze({
  width: 4.5,
  depth: 3.6,
  height: 2.6,
  mount: "freestanding",
  roof: 35,
  finish: "ral7016",
  blade: "match",
  sides: Object.freeze({ front: "none", right: "zip", rear: "sliding", left: "none" }),
  slidingOpen: 30,
  zipOpen: 40,
  led: "warm",
  ledHue: 195,
  ledLevel: 70,
  heaters: 0,
  environment: "studio",
  time: "day"
}), Q = ({ min: c, max: e, step: t }) => ({ type: "range", min: c, max: e, step: t, count: Math.round((e - c) / t) + 1 }), He = [
  ["width", Q(ws)],
  ["depth", Q(ks)],
  ["height", Q(Es)],
  ["mount", { type: "enum", values: ["freestanding", "wall"] }],
  ["roof", Q({ min: 0, max: 90, step: 5 })],
  ["finish", { type: "enum", values: _e.map((c) => c.id) }],
  ["blade", { type: "enum", values: Rs }],
  ["side.front", { type: "enum", values: Ee }],
  ["side.right", { type: "enum", values: Ee }],
  ["side.rear", { type: "enum", values: Ee }],
  ["side.left", { type: "enum", values: Ee }],
  ["slidingOpen", Q({ min: 0, max: Ft, step: 5 })],
  ["zipOpen", Q({ min: 0, max: 100, step: 5 })],
  ["led", { type: "enum", values: Ss }],
  ["ledHue", Q({ min: 0, max: 345, step: 15 })],
  ["ledLevel", Q({ min: 10, max: 100, step: 10 })],
  ["heaters", Q({ min: 0, max: 2, step: 1 })],
  ["environment", { type: "enum", values: Ms }],
  ["time", { type: "enum", values: js }]
].map(([c, e]) => ({ key: c, ...e, count: e.count ?? e.values.length }));
Object.fromEntries(He.map((c) => [c.key, c]));
const rt = (c, e) => {
  var t;
  return e.startsWith("side.") ? (t = c == null ? void 0 : c.sides) == null ? void 0 : t[e.slice(5)] : c == null ? void 0 : c[e];
};
function As(c, { min: e, max: t, step: a }, s) {
  const i = typeof c == "string" ? Number(c) : c;
  if (typeof i != "number" || !Number.isFinite(i)) return s;
  const n = Math.min(t, Math.max(e, i));
  return Ie(e + Math.round((n - e) / a) * a, 2);
}
function ct(c = {}) {
  const e = c && typeof c == "object" ? c : {}, t = { ...Pe, sides: { ...Pe.sides } };
  for (const a of He) {
    const s = rt(Pe, a.key), i = rt(e, a.key), n = a.type === "range" ? As(i, a, s) : a.values.includes(i) ? i : s;
    a.key.startsWith("side.") ? t.sides[a.key.slice(5)] = n : t[a.key] = n;
  }
  return t.mount === "wall" && (t.sides.rear = "none"), t;
}
function Ds(c) {
  const e = Math.max(1, Math.ceil((c.width - 1e-3) / Ts)), t = Math.max(1, Math.ceil((c.depth - 1e-3) / ys)), a = { front: e, rear: e, left: t, right: t }, s = (n) => n + 1;
  let i = 2 * s(e) + 2 * (t - 1);
  return c.mount === "wall" && (i -= s(e)), { baysX: e, baysZ: t, sideBays: a, posts: i };
}
He.reduce((c, e) => c * BigInt(e.count), 1n);
const le = new G();
function U(c, e, t, a, s, i) {
  const n = 2 * Math.PI * s / 4, r = Math.max(i - 2 * s, 0), o = Math.PI / 4;
  le.copy(e), le[a] = 0, le.normalize();
  const b = 0.5 * n / (n + r), h = 1 - le.angleTo(c) / o;
  return Math.sign(le[t]) === 1 ? h * b : r / (n + r) + b + b * (1 - h);
}
class Ue extends gt {
  /**
   * Constructs a new rounded box geometry.
   *
   * @param {number} [width=1] - The width. That is, the length of the edges parallel to the X axis.
   * @param {number} [height=1] - The height. That is, the length of the edges parallel to the Y axis.
   * @param {number} [depth=1] - The depth. That is, the length of the edges parallel to the Z axis.
   * @param {number} [segments=2] - Number of segments that form the rounded corners.
   * @param {number} [radius=0.1] - The radius of the rounded corners.
   */
  constructor(e = 1, t = 1, a = 1, s = 2, i = 0.1) {
    const n = s * 2 + 1;
    if (i = Math.min(e / 2, t / 2, a / 2, i), super(1, 1, 1, n, n, n), this.type = "RoundedBoxGeometry", this.parameters = {
      width: e,
      height: t,
      depth: a,
      segments: s,
      radius: i
    }, n === 1) return;
    const r = this.toNonIndexed();
    this.index = null, this.attributes.position = r.attributes.position, this.attributes.normal = r.attributes.normal, this.attributes.uv = r.attributes.uv;
    const o = new G(), b = new G(), h = new G(e, t, a).divideScalar(2).subScalar(i), l = this.attributes.position.array, d = this.attributes.normal.array, p = this.attributes.uv.array, E = l.length / 6, w = new G(), g = 0.5 / n;
    for (let f = 0, u = 0; f < l.length; f += 3, u += 2)
      switch (o.fromArray(l, f), b.copy(o), b.x -= Math.sign(b.x) * g, b.y -= Math.sign(b.y) * g, b.z -= Math.sign(b.z) * g, b.normalize(), l[f + 0] = h.x * Math.sign(o.x) + b.x * i, l[f + 1] = h.y * Math.sign(o.y) + b.y * i, l[f + 2] = h.z * Math.sign(o.z) + b.z * i, d[f + 0] = b.x, d[f + 1] = b.y, d[f + 2] = b.z, Math.floor(f / E)) {
        case 0:
          w.set(1, 0, 0), p[u + 0] = U(w, b, "z", "y", i, a), p[u + 1] = 1 - U(w, b, "y", "z", i, t);
          break;
        case 1:
          w.set(-1, 0, 0), p[u + 0] = 1 - U(w, b, "z", "y", i, a), p[u + 1] = 1 - U(w, b, "y", "z", i, t);
          break;
        case 2:
          w.set(0, 1, 0), p[u + 0] = 1 - U(w, b, "x", "z", i, e), p[u + 1] = U(w, b, "z", "x", i, a);
          break;
        case 3:
          w.set(0, -1, 0), p[u + 0] = 1 - U(w, b, "x", "z", i, e), p[u + 1] = 1 - U(w, b, "z", "x", i, a);
          break;
        case 4:
          w.set(0, 0, 1), p[u + 0] = 1 - U(w, b, "x", "y", i, e), p[u + 1] = 1 - U(w, b, "y", "x", i, t);
          break;
        case 5:
          w.set(0, 0, -1), p[u + 0] = U(w, b, "x", "y", i, e), p[u + 1] = 1 - U(w, b, "y", "x", i, t);
          break;
      }
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @returns {RoundedBoxGeometry} A new instance.
   */
  static fromJSON(e) {
    return new Ue(
      e.width,
      e.height,
      e.depth,
      e.segments,
      e.radius
    );
  }
}
const te = {
  post: 0.15,
  beamHeight: 0.24,
  beamThickness: 0.15,
  innerBeam: 0.1,
  bladePitch: 0.19,
  bladeWidth: 0.2,
  bladeThickness: 0.03
}, se = 0.12;
class bt {
  constructor() {
    this.parts = /* @__PURE__ */ new Map();
  }
  box(e, t, a, s, i, n, r, o) {
    const h = e.userData.bevel && Math.min(t, a, s) > 0.04 ? new Ue(t, a, s, 2, Math.min(0.012, Math.min(t, a, s) * 0.12)) : new m.BoxGeometry(t, a, s).toNonIndexed();
    h.deleteAttribute("uv"), h.translate(i, n, r), o && h.applyMatrix4(o), this.parts.has(e) || this.parts.set(e, []), this.parts.get(e).push(h);
  }
  meshes() {
    const e = [];
    for (const [t, a] of this.parts) {
      const s = Mt(a, !1);
      a.forEach((n) => n.dispose());
      const i = new m.Mesh(s, t);
      i.castShadow = !t.transparent, i.receiveShadow = !0, e.push(i);
    }
    return e;
  }
}
function vs() {
  const c = te.bladeWidth / 2, e = te.bladeThickness / 2, t = new m.Shape();
  t.moveTo(-c, 0), t.quadraticCurveTo(0, e * 2.1, c, 0), t.quadraticCurveTo(0, -e * 1.2, -c, 0);
  const a = new m.ExtrudeGeometry(t, { depth: 1, bevelEnabled: !1, curveSegments: 8 });
  return a.translate(0, 0, -0.5), a.computeVertexNormals(), a;
}
const ht = (c, e, t) => Array.from({ length: e + 1 }, (a, s) => -c / 2 + t / 2 + s * (c - t) / e);
function Fs(c, e) {
  const t = new m.Group();
  t.name = "pergola";
  const { width: a, depth: s, height: i } = c, { post: n, beamHeight: r, beamThickness: o, innerBeam: b } = te, { baysX: h, baysZ: l } = Ds(c), d = ht(a, h, n), p = ht(s, l, n), E = c.mount === "wall", w = p[0], g = new bt(), f = { sliding: [], zips: [], blades: null, bladeData: [], ledStrips: null, bays: [], bounds: { w: a, d: s, h: i } }, u = /* @__PURE__ */ new Map(), T = (x, R) => u.set(`${x.toFixed(3)}:${R.toFixed(3)}`, [x, R]);
  for (const x of d)
    T(x, p[0]), T(x, p[l]);
  for (const x of p)
    T(d[0], x), T(d[h], x);
  for (const [x, R] of u.values())
    E && Math.abs(R - w) < 1e-6 || (g.box(e.frame, n, i - r / 2, n, x, (i - r / 2) / 2, R), g.box(e.frame, n + 0.07, 0.012, n + 0.07, x, 6e-3, R), g.box(e.trim, n + 4e-3, 0.012, n + 4e-3, x, i - r - 6e-3, R));
  const k = i - r / 2;
  g.box(e.frame, a, r, o, 0, k, s / 2 - o / 2), g.box(e.frame, a, r, o, 0, k, -s / 2 + o / 2), g.box(e.frame, o, r, s - 2 * o, -a / 2 + o / 2, k, 0), g.box(e.frame, o, r, s - 2 * o, a / 2 - o / 2, k, 0), g.box(e.trim, a + 0.01, 0.012, 0.03, 0, i + 6e-3, s / 2 - 0.015), g.box(e.trim, a + 0.01, 0.012, 0.03, 0, i + 6e-3, -s / 2 + 0.015);
  for (let x = 1; x < h; x++) g.box(e.frame, b, r * 0.92, s - 2 * o, d[x], i - r * 0.92 / 2, 0);
  for (let x = 1; x < l; x++) g.box(e.frame, a - 2 * o, r * 0.92, b, 0, i - r * 0.92 / 2, p[x]);
  const _ = new bt(), A = i - r - 4e-3, v = 0.035;
  _.box(e.led, a - 2 * o - 0.04, 8e-3, 0.02, 0, A, s / 2 - o + v), _.box(e.led, a - 2 * o - 0.04, 8e-3, 0.02, 0, A, -s / 2 + o - v), _.box(e.led, 0.02, 8e-3, s - 2 * o - 0.04, -a / 2 + o - v, A, 0), _.box(e.led, 0.02, 8e-3, s - 2 * o - 0.04, a / 2 - o + v, A, 0), f.ledStrips = _.meshes()[0], f.ledStrips.castShadow = !1, t.add(f.ledStrips);
  const y = i - r * 0.42;
  for (let x = 0; x < h; x++)
    for (let R = 0; R < l; R++) {
      const O = d[x] + (x === 0 ? o - n / 2 : b / 2), D = d[x + 1] - (x === h - 1 ? o - n / 2 : b / 2), S = p[R] + (R === 0 ? o - n / 2 : b / 2), P = p[R + 1] - (R === l - 1 ? o - n / 2 : b / 2), F = D - O - 0.02, H = Math.max(1, Math.floor(F / te.bladePitch)), V = (O + D) / 2 - (H - 1) * te.bladePitch / 2, C = P - S - 0.03;
      for (let K = 0; K < H; K++) f.bladeData.push({ x: V + K * te.bladePitch, z: (S + P) / 2, length: C });
      f.bays.push({ x: (O + D) / 2, z: (S + P) / 2 });
    }
  f.blades = new m.InstancedMesh(e.bladeGeometry, e.blade, f.bladeData.length), f.blades.castShadow = !0, f.blades.receiveShadow = !0, f.bladeY = y, t.add(f.blades);
  const M = i - r;
  for (const x of _s) {
    const R = c.sides[x];
    if (R === "none") continue;
    const D = x === "front" || x === "rear" ? d : p, S = new m.Matrix4();
    x === "front" && S.makeTranslation(0, 0, p[l]), x === "rear" && S.makeRotationY(Math.PI).setPosition(0, 0, p[0]), x === "right" && S.makeRotationY(Math.PI / 2).setPosition(d[h], 0, 0), x === "left" && S.makeRotationY(-Math.PI / 2).setPosition(d[0], 0, 0);
    for (let P = 0; P < D.length - 1; P++) {
      const F = D[P] + n / 2, H = D[P + 1] - n / 2, V = H - F, C = (F + H) / 2;
      if (R === "sliding" && Ps(t, g, e, S, f, C, V, M), R === "fixed" && Ls(g, e, S, C, V, M), R === "zip" && Os(t, g, e, S, f, C, V, M), R === "panel") {
        g.box(e.panel, V, M, 0.03, C, M / 2, 0, S);
        for (let K = 1; K < 4; K++) g.box(e.trim, V, 6e-3, 0.034, C, M * K / 4, 0, S);
      }
    }
  }
  if (E) {
    const x = i + 0.9;
    g.box(e.wall, a + 2.4, x, 0.24, 0, x / 2, -s / 2 - 0.12), g.box(e.coping, a + 2.44, 0.05, 0.3, 0, x + 0.025, -s / 2 - 0.12);
  }
  for (const x of g.meshes()) t.add(x);
  return t.userData.parts = f, t;
}
function Ps(c, e, t, a, s, i, n, r) {
  const o = Pt(n), h = n / o + 0.04;
  e.box(t.frame, n, 0.05, 0.11, i, r - 0.025, 0, a), e.box(t.frame, n, 0.02, 0.11, i, 0.01, 0, a);
  const l = r - 0.07, d = Mt([
    new m.BoxGeometry(0.035, l, 0.028).translate(-h / 2 + 0.0175, l / 2, 0),
    new m.BoxGeometry(0.035, l, 0.028).translate(h / 2 - 0.0175, l / 2, 0),
    new m.BoxGeometry(h, 0.05, 0.028).translate(0, 0.025, 0),
    new m.BoxGeometry(h, 0.04, 0.028).translate(0, l - 0.02, 0)
  ]), p = new m.BoxGeometry(h - 0.07, l - 0.09, 8e-3).translate(0, l / 2 + 5e-3, 0), E = { panels: [], closed: [], stacked: [] };
  for (let w = 0; w < o; w++) {
    const g = new m.Group(), f = new m.Mesh(d, t.frame);
    f.castShadow = !0;
    const u = new m.Mesh(p, t.glass);
    u.renderOrder = 2, g.add(f, u), g.userData = { frame: a, z: (w - (o - 1) / 2) * 0.024, y: 0.02 }, E.closed.push(i - n / 2 + h / 2 + w * (n - h) / (o - 1)), E.stacked.push(i - n / 2 + h / 2 + w * 0.035), E.panels.push(g), c.add(g);
  }
  E.geometries = [d, p], s.sliding.push(E);
}
function Ls(c, e, t, a, s, i) {
  const n = Pt(s), r = s / n;
  c.box(e.frame, s, 0.05, 0.06, a, i - 0.025, 0, t), c.box(e.frame, s, 0.05, 0.06, a, 0.025, 0, t);
  for (let o = 0; o <= n; o++) c.box(e.frame, 0.04, i - 0.1, 0.06, a - s / 2 + o * r, i / 2, 0, t);
  for (let o = 0; o < n; o++) c.box(e.glass, r - 0.04, i - 0.1, 0.01, a - s / 2 + r * (o + 0.5), i / 2, 0, t);
}
function Os(c, e, t, a, s, i, n, r) {
  e.box(t.frame, n, se, se, i, r - se / 2, 0.02, a);
  for (const d of [-1, 1]) e.box(t.frame, 0.045, r - se, 0.06, i + d * (n / 2 - 0.0225), (r - se) / 2, 0.02, a);
  const o = new m.PlaneGeometry(n - 0.09, 1).translate(0, -0.5, 0), b = new m.BoxGeometry(n - 0.07, 0.035, 0.04), h = new m.Mesh(o, t.fabric), l = new m.Mesh(b, t.frame);
  h.castShadow = !0, l.castShadow = !0;
  for (const d of [h, l])
    d.matrixAutoUpdate = !1, c.add(d);
  s.zips.push({ fabric: h, bar: l, frame: a, uc: i, top: r - se, travel: r - se - 0.03, geometries: [o, b] });
}
const oe = new m.Object3D(), Le = new m.Matrix4();
function lt(c, e) {
  const t = c == null ? void 0 : c.userData.parts;
  if (!t) return;
  const a = m.MathUtils.degToRad(e.roof);
  t.bladeData.forEach((n, r) => {
    oe.position.set(n.x, t.bladeY, n.z), oe.rotation.set(0, 0, a), oe.scale.set(1, 1, n.length), oe.updateMatrix(), t.blades.setMatrixAt(r, oe.matrix);
  }), t.blades.instanceMatrix.needsUpdate = !0, t.blades.computeBoundingSphere();
  const s = Math.min(1, e.slidingOpen / Ft);
  for (const n of t.sliding)
    n.panels.forEach((r, o) => {
      const b = n.closed[o] + (n.stacked[o] - n.closed[o]) * s;
      r.matrixAutoUpdate = !1, r.matrix.copy(r.userData.frame).multiply(Le.makeTranslation(b, r.userData.y, r.userData.z)), r.matrixWorldNeedsUpdate = !0;
    });
  const i = 1 - e.zipOpen / 100;
  for (const n of t.zips) {
    const r = n.travel * i, o = r > 0.01;
    n.fabric.visible = o, n.bar.visible = o, n.fabric.matrix.copy(n.frame).multiply(Le.compose(new m.Vector3(n.uc, n.top, 0.02), oe.quaternion.identity(), new m.Vector3(1, Math.max(r, 1e-3), 1))), n.bar.matrix.copy(n.frame).multiply(Le.makeTranslation(n.uc, n.top - r - 0.0175, 0.02)), n.fabric.matrixWorldNeedsUpdate = !0, n.bar.matrixWorldNeedsUpdate = !0;
  }
}
function dt(c) {
  var t;
  if (!c) return;
  const e = c.userData.parts;
  c.traverse((a) => {
    a.isMesh && a !== (e == null ? void 0 : e.blades) && !a.geometry.userData.shared && a.geometry.dispose();
  }), (t = e == null ? void 0 : e.blades) == null || t.dispose();
}
const Oe = typeof window < "u" && window.CFG_PERGOLA_ASSETS || "/pergola-configurators/v2/", pt = {
  patio: { file: "env-patio.glb", z: -0.48, rotation: Math.PI * 1.5, scale: 1 },
  pool: { file: "env-pool.glb", z: 1.5, rotation: Math.PI / 2, scale: 0.9 },
  deck: { file: "env-deck.glb", z: 1.35, rotation: Math.PI / 2, scale: 1 },
  rooftop: { file: "env-rooftop.glb", z: 2, rotation: Math.PI / 2, scale: 1.5 }
}, Gs = ["width", "depth", "height", "mount"], ft = () => typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches, qs = (c) => c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2, we = (c) => {
  var e;
  return ((e = _e.find((t) => t.id === c)) == null ? void 0 : e.hex) || _e[0].hex;
};
function Ns() {
  const c = matchMedia("(pointer: coarse)").matches, e = navigator.deviceMemory || 8, t = navigator.hardwareConcurrency || 8, a = e <= 2 || t <= 4 && e <= 3;
  return {
    low: a,
    coarse: c,
    maxPixelRatio: a ? 1.5 : 2,
    shadowSize: a ? 1024 : 2048,
    antialias: !0
  };
}
function Ks() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return !1;
  }
}
class zs {
  constructor(e, { config: t, onStatus: a = () => {
  }, onSceneStatus: s = () => {
  }, label: i = "" } = {}) {
    this.host = e, this.onStatus = a, this.onSceneStatus = s, this.tier = Ns(), this.config = ct(t), this.shown = { roof: this.config.roof, slidingOpen: this.config.slidingOpen, zipOpen: this.config.zipOpen }, this.cache = /* @__PURE__ */ new Map(), this.disposed = !1, this.visible = !0, this.frame = 0, this.slowFrames = 0, this.view = "overview";
    const n = new m.WebGLRenderer({ antialias: this.tier.antialias, powerPreference: "high-performance", alpha: !1 });
    this.targetPixelRatio = Math.min(window.devicePixelRatio || 1, this.tier.maxPixelRatio), this.pixelRatio = this.targetPixelRatio, n.setPixelRatio(this.pixelRatio), n.outputColorSpace = m.SRGBColorSpace, n.toneMapping = m.NeutralToneMapping, n.toneMappingExposure = 1, n.shadowMap.enabled = !0, n.shadowMap.type = m.PCFShadowMap, n.shadowMap.autoUpdate = !1, n.domElement.className = "pc-canvas", n.domElement.setAttribute("role", "img"), n.domElement.setAttribute("aria-label", i), this.renderer = n, e.appendChild(n.domElement), this.scene = new m.Scene(), this.camera = new m.PerspectiveCamera(35, 1, 0.05, 400), this.controls = new Ta(this.camera, n.domElement), Object.assign(this.controls, { enableDamping: !0, dampingFactor: 0.09, enablePan: !1, rotateSpeed: 0.7, zoomSpeed: 0.8, maxPolarAngle: Math.PI / 2 - 0.05 }), n.domElement.style.touchAction = "pan-y", this.controls.addEventListener("start", () => {
      this.tween = null, this.requestRender();
    }), this.controls.addEventListener("change", () => this.requestRender()), this.materials = this.createMaterials(), this.createLights();
    const r = new m.PMREMGenerator(n), o = new Oa();
    this.studioEnv = r.fromScene(o, 0.04).texture, o.dispose(), r.dispose(), this.floor = new m.Mesh(new m.CircleGeometry(60, 48), new m.MeshStandardMaterial({ color: "#d9dad7", roughness: 1 })), this.floor.rotation.x = -Math.PI / 2, this.floor.position.y = -2e-3, this.floor.receiveShadow = !0, this.scene.add(this.floor);
    const b = document.createElement("canvas");
    b.width = b.height = 128;
    const h = b.getContext("2d"), l = h.createRadialGradient(64, 64, 8, 64, 64, 64);
    l.addColorStop(0, "rgba(0,0,0,0.55)"), l.addColorStop(0.55, "rgba(0,0,0,0.28)"), l.addColorStop(1, "rgba(0,0,0,0)"), h.fillStyle = l, h.fillRect(0, 0, 128, 128), this.contactTexture = new m.CanvasTexture(b), this.contact = new m.Mesh(new m.PlaneGeometry(1, 1), new m.MeshBasicMaterial({ map: this.contactTexture, transparent: !0, depthWrite: !1, opacity: 0.6, toneMapped: !1, polygonOffset: !0, polygonOffsetFactor: -2 })), this.contact.rotation.x = -Math.PI / 2, this.contact.position.y = 4e-3, this.contact.renderOrder = 1, this.scene.add(this.contact), this.animationRate = 9, this.onContextLost = (w) => {
      w.preventDefault(), this.onStatus("error");
    }, n.domElement.addEventListener("webglcontextlost", this.onContextLost), this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(e), this.intersection = new IntersectionObserver(([w]) => {
      this.visible = w.isIntersecting, this.visible && this.requestRender();
    }), this.intersection.observe(e), this.onVisibility = () => {
      document.hidden || this.requestRender();
    }, document.addEventListener("visibilitychange", this.onVisibility), this.rebuild(), this.applyScene(), this.setView("overview", { instant: !0 }), this.resize();
    const d = new m.Group(), p = new m.BoxGeometry(1e-3, 1e-3, 1e-3);
    for (const w of Object.values(this.materials)) w != null && w.isMaterial && d.add(new m.Mesh(p, w));
    d.position.y = -50, this.scene.add(d), (n.compileAsync ? n.compileAsync(this.scene, this.camera) : Promise.resolve()).catch(() => {
    }).then(() => {
      this.scene.remove(d), p.dispose(), !this.disposed && (this.onStatus("ready"), this.requestRender());
    });
  }
  createMaterials() {
    const e = we(this.config.finish), t = {
      frame: new m.MeshStandardMaterial({ color: e, roughness: 0.52, metalness: 0.35 }),
      trim: new m.MeshStandardMaterial({ color: "#1d1f21", roughness: 0.7, metalness: 0.2 }),
      blade: new m.MeshStandardMaterial({ color: e, roughness: 0.46, metalness: 0.4 }),
      glass: new m.MeshPhysicalMaterial({ color: "#dfeef0", roughness: 0.04, metalness: 0, transparent: !0, opacity: 0.2, depthWrite: !1, side: m.DoubleSide, envMapIntensity: 1.4 }),
      fabric: new m.MeshStandardMaterial({ color: "#4f5153", roughness: 1, transparent: !0, opacity: 0.86, side: m.DoubleSide }),
      panel: new m.MeshStandardMaterial({ color: e, roughness: 0.62, metalness: 0.2 }),
      led: new m.MeshStandardMaterial({ color: "#fff4e2", emissive: "#ffd7a1", emissiveIntensity: 0, roughness: 0.4 }),
      wall: new m.MeshStandardMaterial({ color: "#d9d6cf", roughness: 0.95 }),
      coping: new m.MeshStandardMaterial({ color: "#bdb9b0", roughness: 0.9 }),
      bladeGeometry: vs()
    };
    return t.frame.userData.bevel = !0, t.panel.userData.bevel = !0, t.wall.userData.bevel = !1, t.bladeGeometry.userData.shared = !0, t;
  }
  createLights() {
    this.hemi = new m.HemisphereLight("#ffffff", "#b9b6ae", 0.6), this.sun = new m.DirectionalLight("#fff6e8", 2.6), this.sun.castShadow = !0, this.sun.shadow.mapSize.set(this.tier.shadowSize, this.tier.shadowSize), this.sun.shadow.normalBias = 0.02, this.sun.shadow.bias = -4e-4, this.sun.shadow.radius = 3, this.scene.add(this.hemi, this.sun, this.sun.target), this.ledLights = Array.from({ length: 4 }, () => {
      const e = new m.PointLight("#ffd7a1", 0, 9, 1.6);
      return this.scene.add(e), e;
    });
  }
  // ---- Configuration ------------------------------------------------------
  // Changes are recorded here and applied at most once per animation frame,
  // so dragging a size slider never rebuilds geometry inside the input event.
  setConfig(e) {
    const t = ct(e), a = this.config;
    this.config = t;
    const s = this.pending || (this.pending = {}), i = ["width", "depth", "height"].some((n) => a[n] !== t[n]);
    (Gs.some((n) => a[n] !== t[n]) || JSON.stringify(a.sides) !== JSON.stringify(t.sides)) && (s.rebuild = !0), i && (s.reframe = !0), a.heaters !== t.heaters && (s.heaters = !0), (a.environment !== t.environment || a.time !== t.time) && (s.scene = !0), s.materials = !0, this.requestRender();
  }
  flushPending() {
    const e = this.pending;
    e && (this.pending = null, e.rebuild ? this.rebuild() : e.heaters && this.placeHeaters(), e.scene && this.applyScene(), e.materials && this.applyMaterials(), e.reframe && (this.fitShadow(), this.setView(this.view, { keepDirection: !0, instant: !0 })));
  }
  rebuild() {
    this.product && (this.scene.remove(this.product), dt(this.product)), this.product = Fs(this.config, this.materials), this.scene.add(this.product), lt(this.product, { ...this.config, ...this.shown }), this.applyMaterials(), this.fitShadow(), this.placeHeaters(), this.environmentModel && this.positionEnvironment();
  }
  applyMaterials() {
    var n;
    const e = this.config;
    this.materials.frame.color.set(we(e.finish)), this.materials.panel.color.set(we(e.finish)).offsetHSL(0, 0, 0.04), this.materials.blade.color.set(we(e.blade === "match" ? e.finish : e.blade));
    const t = e.time === "night", a = e.ledLevel / 100, s = e.led === "color" ? new m.Color().setHSL(e.ledHue / 360, 0.85, 0.55) : new m.Color("#ffd7a1");
    this.materials.led.emissive.copy(s), this.materials.led.emissiveIntensity = e.led === "off" ? 0 : (t ? 6 : 1.2) * a;
    const i = ((n = this.product) == null ? void 0 : n.userData.parts.bays) || [];
    this.ledLights.forEach((r, o) => {
      const b = i[o];
      r.color.copy(s), r.intensity = b && e.led !== "off" && t ? 7 * a : 0, b && r.position.set(b.x, e.height * 0.5, b.z);
    });
  }
  fitShadow() {
    const { w: e, d: t } = this.product.userData.parts.bounds;
    this.contact.scale.set(e * 1.35 + 0.8, t * 1.35 + 0.8, 1);
    const a = Math.max(e, t) / 2 + 2.2;
    this.sun.position.set(-6, 11, 7.5), this.sun.target.position.set(0, 0, 0), Object.assign(this.sun.shadow.camera, { left: -a, right: a, top: a, bottom: -a, near: 0.5, far: 40 }), this.sun.shadow.camera.updateProjectionMatrix(), this.renderer.shadowMap.needsUpdate = !0;
  }
  // ---- Scene: environment + light ------------------------------------------
  applyScene() {
    var i;
    const { environment: e, time: t } = this.config, a = t === "night", s = e !== "studio";
    this.floor.visible = !s || !this.environmentModel, this.floor.material.color.set(a ? "#2a3240" : "#d9dad7"), this.hemi.intensity = a ? 0.9 : 0.6, this.hemi.color.set(a ? "#8fa4d6" : "#ffffff"), this.sun.intensity = a ? 0.6 : 2.6, this.sun.color.set(a ? "#9fb6e8" : "#fff6e8"), this.scene.environmentIntensity = a ? 0.38 : s ? 0.9 : 0.75, this.renderer.toneMappingExposure = a ? 1.05 : 1, s && !a && this.skyTexture ? (this.scene.background = this.skyTexture, this.scene.backgroundBlurriness = 0.04, this.scene.backgroundIntensity = 0.85) : this.scene.background = new m.Color(a ? "#131b28" : s ? "#bcd0de" : "#e4e5e3"), (i = this.scene).fog || (i.fog = new m.Fog("#e4e5e3", 18, 46)), this.scene.fog.color.set(a ? "#131b28" : "#e4e5e3"), this.scene.fog.near = s ? 900 : 18, this.scene.fog.far = s ? 1e3 : 46, this.scene.environment = s && !a && this.skyEnv ? this.skyEnv : this.studioEnv, s && !this.skyTexture && this.loadSky(), this.loadEnvironment(e), this.applyMaterials(), this.renderer.shadowMap.needsUpdate = !0, this.requestRender();
  }
  load(e) {
    if (!this.cache.has(e)) {
      const t = new qa().setMeshoptDecoder(xs);
      this.cache.set(e, t.loadAsync(e).then((a) => a.scene).catch((a) => {
        throw this.cache.delete(e), a;
      }));
    }
    return this.cache.get(e);
  }
  loadSky() {
    this.skyPromise || (this.skyPromise = new gs().loadAsync(`${Oe}sky-1k.hdr`).then((e) => {
      if (this.disposed) {
        e.dispose();
        return;
      }
      e.mapping = m.EquirectangularReflectionMapping;
      const t = new m.PMREMGenerator(this.renderer);
      this.skyEnv = t.fromEquirectangular(e).texture, t.dispose(), this.skyTexture = e, this.applyScene();
    }).catch(() => {
      this.skyPromise = null;
    }));
  }
  loadEnvironment(e) {
    if (this.environmentModel && this.environmentModel.userData.id !== e && (this.scene.remove(this.environmentModel), this.environmentModel = null, this.floor.visible = !0), e === "studio") {
      this.environmentPending = null, this.onSceneStatus("ready");
      return;
    }
    if (this.environmentModel || this.environmentPending === e) return;
    this.environmentPending = e;
    const t = this.environmentToken = Symbol(e);
    this.onSceneStatus("loading");
    const a = pt[e];
    this.load(`${Oe}${a.file}`).then((s) => this.disposed || this.environmentToken !== t || this.config.environment !== e ? null : (s.userData.prepared || (s.traverse((i) => {
      i.isMesh && (i.castShadow = !0, i.receiveShadow = !0);
    }), s.userData.prepared = !0), s.userData.id = e, (this.renderer.compileAsync ? this.renderer.compileAsync(s, this.camera, this.scene) : Promise.resolve()).catch(() => {
    }).then(() => s))).then((s) => {
      this.environmentToken === t && (this.environmentPending = null), !(!s || this.disposed || this.environmentToken !== t || this.config.environment !== e) && (s.rotation.y = a.rotation, s.scale.setScalar(a.scale), this.environmentModel = s, this.positionEnvironment(), this.scene.add(s), this.floor.visible = !1, this.onSceneStatus("ready"), this.applyScene());
    }).catch(() => {
      this.environmentToken === t && (this.environmentPending = null, this.floor.visible = !0, this.onSceneStatus("error"), this.requestRender());
    });
  }
  positionEnvironment() {
    const e = pt[this.environmentModel.userData.id];
    this.environmentModel.position.set(0, 0, e.z + this.config.depth / 2), this.renderer.shadowMap.needsUpdate = !0;
  }
  placeHeaters() {
    this.heaters && (this.scene.remove(this.heaters), this.heaters = null);
    const e = this.config.heaters;
    if (!e) {
      this.requestRender();
      return;
    }
    const t = this.heaterToken = Symbol("heaters");
    this.load(`${Oe}heater.glb`).then((a) => {
      if (this.disposed || this.heaterToken !== t) return;
      const s = new m.Group(), i = new m.Box3().setFromObject(a), n = i.getSize(new m.Vector3()), r = i.getCenter(new m.Vector3()), { width: o, height: b } = this.config, h = e === 1 ? [-1] : [-1, 1];
      for (const l of h) {
        const d = new m.Group(), p = a.clone();
        p.traverse((E) => {
          E.isMesh && (E.castShadow = !0);
        }), p.position.copy(r).multiplyScalar(-1), d.add(p), d.scale.setScalar(0.62 / Math.max(n.x, n.y, n.z) * 1), d.rotation.set(-l * 0.6, Math.PI / 2, 0, "YXZ"), d.position.set(l * (o / 2 - te.beamThickness - 0.2), b - te.beamHeight - 0.2, 0), s.add(d);
      }
      this.heaters = s, this.scene.add(s), this.renderer.shadowMap.needsUpdate = !0, this.requestRender();
    }).catch(() => {
    });
  }
  // ---- Camera ---------------------------------------------------------------
  frameFor(e) {
    const { width: t, depth: a, height: s } = this.config, i = Math.sqrt(t * t + a * a + s * s) / 2, n = m.MathUtils.degToRad(this.camera.fov / 2), r = Math.atan(Math.tan(n) * this.camera.aspect), o = this.host.clientWidth < 640, b = i / Math.sin(Math.min(n, r)) * (o ? 1.16 : 1.04), h = new m.Vector3(0, s * 0.42, 0), l = this.config.environment !== "studio" ? 1.1 : 1;
    if (e === "detail") {
      const w = new m.Vector3(t / 2 - 0.15, s - 0.45, a / 2 - 0.1);
      return { position: new m.Vector3(t / 2 + 1.1, s - 0.15, a / 2 + 1.5), target: w, min: 0.4, max: i * 5 };
    }
    const d = {
      roof: new m.Vector3(0.7, 1.05, 1),
      overview: new m.Vector3(0.78, 0.46, 1),
      front: new m.Vector3(0, 0.22, 1),
      side: new m.Vector3(1, 0.22, 0.02),
      top: new m.Vector3(1e-3, 1, 0.12)
    };
    if (e === "inside")
      return { position: new m.Vector3(0, 1.55, a / 2 - 0.45), target: new m.Vector3(0, 1.45, -a / 2), min: 0.05, max: i * 5 };
    const p = (d[e] || d.overview).clone().normalize(), E = e === "roof" ? 1.18 : 1;
    return { position: h.clone().add(p.multiplyScalar(b * l * E)), target: h, min: i * 1.05, max: i * 5 };
  }
  /** Speed of option animations (louvers, glass, screens). Demo uses slower. */
  setAnimationRate(e) {
    this.animationRate = e;
  }
  setView(e, { instant: t = !1, keepDirection: a = !1, duration: s = 700 } = {}) {
    this.view = e;
    const i = e === "inside" ? 62 : 35;
    this.camera.fov !== i && (this.camera.fov = i, this.camera.updateProjectionMatrix());
    const n = this.frameFor(e);
    if (a && e !== "inside") {
      const r = this.camera.position.clone().sub(this.controls.target).normalize();
      n.position = n.target.clone().add(r.multiplyScalar(n.position.distanceTo(n.target)));
    }
    this.controls.minDistance = n.min, this.controls.maxDistance = n.max, t || ft() ? (this.tween = null, this.camera.position.copy(n.position), this.controls.target.copy(n.target), this.controls.update()) : this.tween = { from: this.camera.position.clone(), to: n.position, fromTarget: this.controls.target.clone(), toTarget: n.target, start: performance.now(), duration: s }, this.requestRender();
  }
  rotateBy(e, t = 0) {
    const a = this.camera.position.clone().sub(this.controls.target), s = new m.Spherical().setFromVector3(a);
    s.theta += e, s.phi = m.MathUtils.clamp(s.phi + t, 0.1, this.controls.maxPolarAngle), this.camera.position.copy(this.controls.target).add(new m.Vector3().setFromSpherical(s)), this.tween = null, this.controls.update(), this.requestRender();
  }
  zoomBy(e) {
    const t = this.camera.position.clone().sub(this.controls.target), a = m.MathUtils.clamp(t.length() * e, this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(t.setLength(a)), this.tween = null, this.controls.update(), this.requestRender();
  }
  // ---- Loop -----------------------------------------------------------------
  requestRender() {
    this.disposed || this.frame || !this.visible || document.hidden || (this.lastTime = performance.now(), this.frame = requestAnimationFrame((e) => this.tick(e)));
  }
  tick(e) {
    if (this.frame = 0, this.disposed) return;
    const t = Math.min(0.1, (e - this.lastTime) / 1e3);
    this.lastTime = e;
    let a = !1;
    if (this.flushPending(), this.tween) {
      const n = Math.min(1, (e - this.tween.start) / this.tween.duration), r = qs(n);
      this.camera.position.lerpVectors(this.tween.from, this.tween.to, r), this.controls.target.lerpVectors(this.tween.fromTarget, this.tween.toTarget, r), n >= 1 ? this.tween = null : a = !0;
    }
    this.controls.update(t) && (a = !0);
    let s = !1;
    const i = ft();
    for (const n of ["roof", "slidingOpen", "zipOpen"]) {
      const r = this.config[n] - this.shown[n];
      Math.abs(r) < 0.2 || i ? this.shown[n] !== this.config[n] && (this.shown[n] = this.config[n], s = !0) : (this.shown[n] += r * (1 - Math.exp(-t * this.animationRate)), s = !0, a = !0);
    }
    s && (lt(this.product, { ...this.config, ...this.shown }), this.renderer.shadowMap.needsUpdate = !0), this.renderer.render(this.scene, this.camera), a && t > 0.034 ? this.slowFrames += 1 : this.slowFrames = Math.max(0, this.slowFrames - 1), this.slowFrames > 12 && this.pixelRatio > 1 && (this.pixelRatio = Math.max(1, this.pixelRatio - 0.25), this.renderer.setPixelRatio(this.pixelRatio), this.resize(), this.slowFrames = 0), a ? (this.lastBusy = e, this.requestRender()) : this.pixelRatio < this.targetPixelRatio && (this.pixelRatio = this.targetPixelRatio, this.renderer.setPixelRatio(this.pixelRatio), this.resize());
  }
  resize() {
    const { width: e, height: t } = this.host.getBoundingClientRect();
    !e || !t || (this.renderer.setSize(e, t, !1), this.camera.aspect = e / t, this.camera.updateProjectionMatrix(), this.requestRender());
  }
  // ---- Export ---------------------------------------------------------------
  /** Renders the current view and returns a PNG blob with a caption band. */
  snapshot(e) {
    this.renderer.render(this.scene, this.camera);
    const t = this.renderer.domElement, a = Math.round(t.height * 0.07), s = document.createElement("canvas");
    s.width = t.width, s.height = t.height + a;
    const i = s.getContext("2d");
    return i.drawImage(t, 0, 0), i.fillStyle = "#15171a", i.fillRect(0, t.height, s.width, a), i.fillStyle = "#f2f3f1", i.font = `500 ${Math.round(a * 0.36)}px system-ui, sans-serif`, i.textBaseline = "middle", i.fillText(e, Math.round(a * 0.5), t.height + a / 2), new Promise((n) => s.toBlob(n, "image/png"));
  }
  dispose() {
    var a, s, i;
    this.disposed = !0, cancelAnimationFrame(this.frame), this.resizeObserver.disconnect(), this.intersection.disconnect(), document.removeEventListener("visibilitychange", this.onVisibility), this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost), this.controls.dispose(), dt(this.product);
    const e = /* @__PURE__ */ new Set(), t = new Set(Object.values(this.materials).filter((n) => n == null ? void 0 : n.isMaterial));
    this.scene.traverse((n) => {
      var r;
      if (n.isMesh) {
        (r = n.geometry) == null || r.dispose();
        for (const o of [].concat(n.material)) t.add(o);
      }
    }), Promise.allSettled([...this.cache.values()]).then((n) => {
      var r, o;
      for (const b of n) (o = (r = b.value) == null ? void 0 : r.traverse) == null || o.call(r, (h) => {
        if (h.isMesh) {
          h.geometry.dispose();
          for (const l of [].concat(h.material)) t.add(l);
        }
      });
      for (const b of t) {
        for (const h of Object.values(b)) h != null && h.isTexture && e.add(h);
        b.dispose();
      }
      e.forEach((b) => b.dispose());
    }), this.materials.bladeGeometry.dispose(), this.contactTexture.dispose(), (a = this.studioEnv) == null || a.dispose(), (s = this.skyEnv) == null || s.dispose(), (i = this.skyTexture) == null || i.dispose(), this.renderer.dispose(), this.renderer.forceContextLoss(), this.renderer.domElement.remove();
  }
}
const Cs = { Anthracite: "ral7016", Sand: "ral1015", "Signal white": "ral9016" }, Is = ["right", "left", "rear"];
function ut(c) {
  const e = { front: "none", right: "none", rear: "none", left: "none" };
  return Is.slice(0, Math.min(3, c.screens || 0)).forEach((t) => e[t] = "zip"), {
    width: c.width / 100,
    depth: c.depth / 100,
    height: 2.6,
    mount: "freestanding",
    roof: 35,
    finish: Cs[c.finish] || "ral7016",
    blade: "match",
    sides: e,
    zipOpen: 30,
    led: c.lighting ? "warm" : "off",
    heaters: 0,
    environment: "patio",
    time: "day"
  };
}
function Us(c, e, { onStatus: t } = {}) {
  if (!Ks()) throw new Error("WebGL unavailable");
  const a = new zs(c, {
    config: ut(e),
    label: "3D preview of your configured pergola",
    onStatus: (s) => t == null ? void 0 : t(s)
  });
  return {
    update: (s) => a.setConfig(ut(s)),
    dispose: () => a.dispose()
  };
}
export {
  Us as mountViewer,
  ut as toEngineConfig
};
