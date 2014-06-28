/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

        var scope = this;
        var freezeForward = false;
        var freezeBackward = false;
        var freezeRight = false;
        var freezeLeft = false;

        camera.rotation.set( 0, 0, 0 );

        var pitchObject = new THREE.Object3D();
        pitchObject.add( camera );

        var yawObject = new THREE.Object3D();
        yawObject.position.y = 2;
        yawObject.add( pitchObject );

        var moveForward = false;
        var moveBackward = false;
        var moveLeft = false;
        var moveRight = false;

        var isOnObject = false;
        var canJump = false;

        var prevTime = performance.now();

        var velocity = new THREE.Vector3();

        var PI_2 = Math.PI / 2;

        var onMouseMove = function ( event ) {

                if ( scope.enabled === false ) return;

                var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
                var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

                yawObject.rotation.y -= movementX * 0.002;
                pitchObject.rotation.x -= movementY * 0.002;

                pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

        };

        this.getMoveForward= function(){
                return moveForward;
        };

        this.getMoveBackward= function(){
                return moveBackward;
        };

        this.getMoveLeft= function(){
                return moveLeft;
        };

        this.getMoveRight= function(){
                return moveRight;
        };

        // this.setMoveForward= function(b){
        //         moveForward=b;
        // };

        this.setFreezeForward= function(b){
                freezeForward=b;
        }

        this.setFreezeBackward= function(b){
                freezeBackward=b;
        }
        this.setFreezeRight= function(b){
                freezeRight=b;
        }
        this.setFreezeLeft= function(b){
                freezeLeft=b;
        }

        var onKeyDown = function ( event ) {

                switch ( event.keyCode ) {

                        case 38: // up
                        case 87: // w
                                moveForward = true;
                                break;

                        case 37: // left
                        case 65: // a
                                moveLeft = true; break;

                        case 40: // down
                        case 83: // s
                                moveBackward = true;
                                break;

                        case 39: // right
                        case 68: // d
                                moveRight = true;
                                break;

                        case 32: // space
                                if ( canJump === true ) velocity.y += 130;
                                canJump = false;
                                break;

                }

        };

        var onKeyUp = function ( event ) {

                switch( event.keyCode ) {

                        case 38: // up
                        case 87: // w
                                moveForward = false;
                                break;

                        case 37: // left
                        case 65: // a
                                moveLeft = false;
                                break;

                        case 40: // down
                        case 83: // s
                                moveBackward = false;
                                break;

                        case 39: // right
                        case 68: // d
                                moveRight = false;
                                break;

                }

        };

        document.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );

        this.enabled = false;

        this.getObject = function () {

                return yawObject;

        };

        this.isOnObject = function ( boolean ) {

                isOnObject = boolean;
                canJump = boolean;

        };

        this.getDirection = function() {

                // assumes the camera itself is not rotated

                var direction = new THREE.Vector3( 0, 0, -1 );
                var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

                return function( v ) {

                        rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

                        v.copy( direction ).applyEuler( rotation );

                        return v;

                }

        }();

        this.update = function () {

                if ( scope.enabled === false ) return;

                var time = performance.now();
                var delta = ( time - prevTime ) / 3000;

                velocity.x -= velocity.x * 20.0 * delta;
                velocity.z -= velocity.z * 20.0 * delta;

                velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                if(!freezeForward){
                        if ( moveForward ) velocity.z -= 1600.0 * delta;
                }
                
                if(!freezeBackward){
                        if ( moveBackward ) velocity.z += 1600.0 * delta;
                }
                
                if(!freezeLeft){
                        if ( moveLeft ) velocity.x -= 1600.0 * delta;
                }

                if(!freezeRight){
                        if ( moveRight ) velocity.x += 1600.0 * delta;
                }
                        if ( isOnObject === true ) {

                                velocity.y = Math.max( 0, velocity.y );

                        }
                

                yawObject.translateX( velocity.x * delta );
                yawObject.translateY( velocity.y * delta ); 
                yawObject.translateZ( velocity.z * delta );

                if ( yawObject.position.y < 35 ) {

                        velocity.y = 0;
                        yawObject.position.y = 35;

                        canJump = true;

                }

                prevTime = time;

        };

};