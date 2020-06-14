import React, { useRef, useState, useEffect } from 'react';
import {
  theme,
  ThemeProvider,
  CSSReset,
  Box,
  Flex,
  Stack,
  Text,
  Image,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/core';
import { nanoid } from 'nanoid';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';
import { OrbitControls } from 'drei';

// assets
import SandboxLogo from 'assets/logo.png';
import Background from 'assets/background.png';
import Hipster from 'assets/Hipster.png';
import Elf from 'assets/Elf.png';
import Sonic from 'assets/Sonic.png';
import Vampire from 'assets/Vampire.png';
import Premium from 'assets/Premium.png';

import ArmsOBJ from './Spacehero-arms.obj';
import ChestOBJ from './Spacehero-chest.obj';
import HeadOBJ from './Spacehero-head.obj';
import LegsOBJ from './Spacehero-legs.obj';
import ShoesOBJ from './Spacehero-shoes.obj';

import ArmsPNG from './Spacehero_arms.png';
import ChestPNG from './Spacehero_chest.png';
import HeadPNG from './Spacehero_head.png';
import LegsPNG from './Spacehero_legs.png';
import ShoesPNG from './Spacehero_shoes.png';

import ArmsMTL from './Spacehero-arms.mtl';
import ChestMTL from './Spacehero-chest.mtl';
import HeadMTL from './Spacehero-head.mtl';
import LegsMTL from './Spacehero-legs.mtl';
import ShoesMTL from './Spacehero-shoes.mtl';

// constants
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    grey1: '#505760',
    grey2: '#292E36',
    grey3: '#3B4148',
    grey5: '#14181D',
    blue1: '#0084FF',
  },
};

const predesignedCharacters = [
  {
    name: 'Hipster',
    image: Hipster,
    id: nanoid(),
  },
  {
    name: 'Elf',
    image: Elf,
    id: nanoid(),
  },
  {
    name: 'Sonic',
    image: Sonic,
    id: nanoid(),
  },
  {
    name: 'Vampire',
    image: Vampire,
    id: nanoid(),
  },
  ...Array.from({ length: 20 }, () => ({ name: 'Premium', image: Premium, id: nanoid() })),
];

// components
const PrimaryButton = ({ children, ...props }) => (
  <Button backgroundColor="blue1" borderColor="blue1" borderRadius="45px" paddingX={12} {...props}>
    {children}
  </Button>
);

const SecondaryButton = ({ children, ...props }) => (
  <Button
    backgroundColor="transparent"
    borderWidth={1}
    color="blue1"
    borderColor="blue1"
    borderRadius="45px"
    paddingX={12}
    {...props}
  >
    {children}
  </Button>
);

const CustomTab = React.forwardRef(({ children, isSelected, ...props }, ref) => (
  <Tab ref={ref} isSelected={isSelected} color="white" fontWeight={isSelected ? 700 : 400} {...props}>
    {children}
  </Tab>
));

// three components

function Asset({ name, object, png }) {
  const [objectModel, setObjectModel] = useState();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const mapTexture = textureLoader.load(png);
    const loadedMaterial = new THREE.MeshStandardMaterial({ map: mapTexture });

    const loader = new OBJLoader2();

    loader.load(object, function (object) {
      // object.traverse(function (node) {
      //   node.material = loadedMaterial;
      // });

      object.name = name;

      setObjectModel(object);
    });
  }, [name, object, png]);

  if (!objectModel) return null;

  return (
    <mesh scale={[6, 6, 6]} position={[0,-1,0]} material={new THREE.MeshBasicMaterial({ color: new THREE.Color('hotpink') })}>
      <primitive object={objectModel} />
    </mesh>
  );
}

function ThreeBox(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

const CharacterCard = ({ image, name }) => (
  <Flex
    flexDirection="column"
    backgroundColor="grey1"
    height={230}
    width={138}
    borderRadius={8}
    _hover={{ boxShadow: 'inset 0px 0px 10px 0px rgba(0,0,0,0.75)' }}
  >
    <Flex flex="1" padding={2} justifyContent="center" alignItems="center">
      <Image objectFit="cover" src={image} alt="Sandbox" />
    </Flex>
    <Box
      flexBasis={43}
      textAlign="center"
      backgroundColor="grey3"
      borderBottomLeftRadius={8}
      borderBottomRightRadius={8}
      paddingY={2}
    >
      <Text textTransform="uppercase" fontWeight={700} fontSize={12}>
        {name}
      </Text>
    </Box>
  </Flex>
);

// Main App
function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <Box height="100vh" backgroundColor={'white'}>
        {/* Navbar */}
        <Flex
          height={100}
          bg="grey5"
          color="white"
          paddingX={10}
          paddingY={4}
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Stack isInline spacing={8} align="center">
            <Image objectFit="cover" src={SandboxLogo} alt="Sandbox" />
            <Text fontSize={20}>Create your avatar</Text>
          </Stack>
          <Stack isInline align="center">
            <SecondaryButton>Cancel</SecondaryButton>
            <PrimaryButton marginLeft={2}>Save Avatar</PrimaryButton>
          </Stack>
        </Flex>

        {/* Body */}
        <Flex
          backgroundImage={`url(${Background})`}
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          height={'calc(100vh - 100px)'}
          flexDirection="row"
          padding={70}
          justifyContent="space-between"
        >
          {/* Canvas */}
          <Box flex="1">
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <Asset name="arms" object={ArmsOBJ} png={ArmsPNG} material={ArmsMTL} />
              <Asset name="chest" object={ChestOBJ} png={ChestPNG} material={ChestMTL} />
              <Asset name="head" object={HeadOBJ} png={HeadPNG} material={HeadMTL} />
              <Asset name="legs" object={LegsOBJ} png={LegsPNG} material={LegsMTL} />
              <Asset name="shoes" object={ShoesOBJ} png={ShoesPNG} material={ShoesMTL} />
              <OrbitControls />
            </Canvas>
          </Box>
          {/* Picker */}
          <Box
            flex="1"
            borderRadius={18}
            maxWidth={708}
            height="100%"
            color="white"
            backgroundColor="grey2"
            paddingX={8}
            paddingY={4}
          >
            <Tabs height="100%">
              <TabList>
                <CustomTab flex="1">Predesigned</CustomTab>
                <CustomTab flex="1">Head</CustomTab>
                <CustomTab flex="1">Body</CustomTab>
                <CustomTab flex="1">Legs</CustomTab>
                <CustomTab flex="1">Shoes</CustomTab>
                <CustomTab flex="1">Pixel Art</CustomTab>
              </TabList>

              <TabPanels paddingY={2} height="100%" position="relative">
                <TabPanel
                  height="95%"
                  display="grid"
                  gridGap={3}
                  overflow="auto"
                  gridTemplateColumns="repeat(auto-fill, 138px)"
                >
                  {predesignedCharacters.map(({ image, name, id }) => (
                    <CharacterCard key={id} image={image} name={name}></CharacterCard>
                  ))}
                </TabPanel>
                <Box
                  position="absolute"
                  left="0"
                  right="0"
                  bottom="40px"
                  height={47}
                  width="100%"
                  d="block"
                  background="linear-gradient(180deg, rgba(41, 46, 54, 0) 0%, #292E36 100%)"
                />
              </TabPanels>
            </Tabs>
          </Box>
        </Flex>
      </Box>
    </ThemeProvider>
  );
}

export default App;
