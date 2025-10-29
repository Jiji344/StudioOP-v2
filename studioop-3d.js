// Script pour charger et afficher le modèle 3D StudioOP
let scene, camera, renderer, model, mixer, clock;
let mouseX = 0, mouseY = 0;

function initStudioOP3D() {
    // Créer la scène
    scene = new THREE.Scene();
    scene.background = null; // Transparent

    // Créer la caméra
    const container = document.getElementById('studioop-3d-container');
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    // Créer le renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lumière blanche diffuse pour éclairer la scène
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Lumière blanche en face du modèle
    const frontWhiteLight = new THREE.DirectionalLight(0xffffff, 1.5);
    frontWhiteLight.position.set(0, 0, 5);
    frontWhiteLight.castShadow = true;
    scene.add(frontWhiteLight);

    // Éclairage rouge et violet
    const redLight = new THREE.DirectionalLight(0xff0000, 1.0);
    redLight.position.set(2, 2, 3);
    redLight.castShadow = true;
    scene.add(redLight);

    const violetLight = new THREE.DirectionalLight(0x8a2be2, 1.0);
    violetLight.position.set(-2, 2, 3);
    violetLight.castShadow = true;
    scene.add(violetLight);

    // Charger le modèle GLB
    const loader = new THREE.GLTFLoader();
    loader.load('./3D/StudioOP.glb', (gltf) => {
        model = gltf.scene;
        
        // Ajuster la taille et position du modèle
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Centrer le modèle
        model.position.sub(center);
        
        // Ajuster la taille pour qu'elle soit énorme mais visible en entier
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 7 / maxDim; // Plus grand qu'avant
        model.scale.setScalar(scale);
        
        // Positionner le modèle face à la caméra et le redresser
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        
        // Faire pivoter le modèle pour qu'il soit debout face à la caméra
        // Rotation autour de l'axe X pour le redresser (90° dans le sens horaire)
        model.rotateX(Math.PI / 2);
        
        scene.add(model);

        // Animation mixer si le modèle a des animations
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
        }

        // Rotation automatique
        animate();
    }, undefined, (error) => {
        console.error('Erreur lors du chargement du modèle 3D:', error);
    });

    // Clock pour les animations
    clock = new THREE.Clock();

    // Gérer le redimensionnement
    window.addEventListener('resize', onWindowResize);
    
    // Gérer le mouvement de la souris
    window.addEventListener('mousemove', onMouseMove);
}

function animate() {
    requestAnimationFrame(animate);

    // Suivi léger de la souris
    if (model) {
        // Calculer la rotation basée sur la position de la souris
        const targetRotationY = (mouseX - window.innerWidth / 2) * 0.0005;
        const targetRotationX = (mouseY - window.innerHeight / 2) * 0.0003;
        
        // Interpolation douce pour un mouvement fluide
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
    }

    // Mise à jour des animations
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}

function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onWindowResize() {
    const container = document.getElementById('studioop-3d-container');
    if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre un peu que la page soit complètement chargée
    setTimeout(initStudioOP3D, 100);
});
