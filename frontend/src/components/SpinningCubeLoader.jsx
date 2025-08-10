import React from "react";

/**
 * SpinningCubeLoader - A 3D animated loading spinner with rotating cubes
 * @returns {JSX.Element} Animated loading component
 */
const SpinningCubeLoader = () => {
	// Animation configuration constants
	const ANIMATION_CONFIG = {
		cubeSize: 32, // px
		animationDuration: "800ms",
		totalCubes: 4,
		totalFaces: 4
	};

	// Color palette for cube faces
	const FACE_COLORS = {
		primary: "#5C8DF6",
		secondary: "#145af2", 
		tertiary: "#447cf5",
		quaternary: "#DBE3F4"
	};

	/**
	 * Generates the transform style for cube positioning
	 * @param {number} cubeIndex - Index of the cube (1-4)
	 * @returns {string} CSS transform value
	 */
	const getCubeTransform = (cubeIndex) => {
		const transforms = {
			1: "translate(100%, 0)",
			2: "translate(0, 100%)", 
			3: "translate(100%, 100%)",
			4: "translate(200%, 0)"
		};
		return transforms[cubeIndex] || transforms[1];
	};

	/**
	 * Generates the animation name for each cube
	 * @param {number} cubeIndex - Index of the cube (1-4)
	 * @returns {string} Animation name
	 */
	const getCubeAnimation = (cubeIndex) => {
		return `cube${cubeIndex}`;
	};

	/**
	 * Generates the face color based on face index
	 * @param {number} faceIndex - Index of the face (1-4)
	 * @returns {string} Color value
	 */
	const getFaceColor = (faceIndex) => {
		const colors = [
			FACE_COLORS.primary,
			FACE_COLORS.secondary,
			FACE_COLORS.tertiary,
			FACE_COLORS.quaternary
		];
		return colors[faceIndex - 1] || colors[0];
	};

	/**
	 * Generates the transform style for cube faces
	 * @param {number} faceIndex - Index of the face (1-4)
	 * @returns {object} Style object with positioning and transform
	 */
	const getFaceTransform = (faceIndex) => {
		const { cubeSize } = ANIMATION_CONFIG;
		
		const faceStyles = {
			1: {
				top: "0",
				left: "0",
				right: "auto",
				bottom: "auto",
				transform: `rotateY(0deg) rotateX(0deg) translateZ(${cubeSize / 2}px)`
			},
			2: {
				top: "0",
				left: "auto",
				right: "0",
				bottom: "auto", 
				transform: `rotateY(90deg) rotateX(0deg) translateZ(${cubeSize / 2}px)`
			},
			3: {
				top: "auto",
				left: "0",
				right: "auto",
				bottom: "0",
				transform: `rotateY(0deg) rotateX(-90deg) translateZ(${cubeSize / 2}px)`
			},
			4: {
				top: "0",
				left: "0",
				right: "auto",
				bottom: "auto",
				transform: `rotateY(0deg) rotateX(0deg) translateZ(${cubeSize * 3 * -1}px)`
			}
		};

		return faceStyles[faceIndex] || faceStyles[1];
	};

	/**
	 * Generates CSS keyframe animations for cube movement
	 * @returns {string} CSS keyframe definitions
	 */
	const generateKeyframeAnimations = () => `
		@keyframes cube1 {
			0%, 50% { transform: translate(100%, 0); }
			100% { transform: translate(200%, 0); }
		}
		@keyframes cube2 {
			0% { transform: translate(0, 100%); }
			50% { transform: translate(0, 0); }
			100% { transform: translate(100%, 0); }
		}
		@keyframes cube3 {
			0%, 50% { transform: translate(100%, 100%); }
			100% { transform: translate(0, 100%); }
		}
		@keyframes cube4 {
			0% { transform: translate(200%, 0); }
			50% { transform: translate(200%, 100%); }
			100% { transform: translate(100%, 100%); }
		}
	`;

	// Calculate container dimensions
	const containerHeight = ANIMATION_CONFIG.cubeSize * 2;
	const containerWidth = ANIMATION_CONFIG.cubeSize * 3;
	const containerMarginTop = ANIMATION_CONFIG.cubeSize * 1.5 * -1;

	return (
		<div className="flex justify-center items-center h-screen w-screen">
			<div
				className="boxes relative"
				style={{
					height: `${containerHeight}px`,
					width: `${containerWidth}px`,
					transformStyle: "preserve-3d",
					transformOrigin: "50% 50%",
					marginTop: `${containerMarginTop}px`,
					transform: "rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px)"
				}}
			>
				{/* Render individual cubes */}
				{Array.from({ length: ANIMATION_CONFIG.totalCubes }, (_, index) => {
					const cubeIndex = index + 1;
					return (
						<div
							key={cubeIndex}
							className="box absolute top-0 left-0"
							style={{
								width: `${ANIMATION_CONFIG.cubeSize}px`,
								height: `${ANIMATION_CONFIG.cubeSize}px`,
								transform: getCubeTransform(cubeIndex),
								animation: `${getCubeAnimation(cubeIndex)} ${ANIMATION_CONFIG.animationDuration} linear infinite`
							}}
						>
							{/* Render cube faces */}
							{Array.from({ length: ANIMATION_CONFIG.totalFaces }, (_, faceIndex) => {
								const faceNumber = faceIndex + 1;
								const faceStyle = getFaceTransform(faceNumber);
								
								return (
									<div
										key={faceNumber}
										className="absolute w-full h-full"
										style={{
											background: getFaceColor(faceNumber),
											...faceStyle
										}}
									/>
								);
							})}
						</div>
					);
				})}

				{/* CSS Animations */}
				<style>{generateKeyframeAnimations()}</style>
			</div>
		</div>
	);
};

export default SpinningCubeLoader;
