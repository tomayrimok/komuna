import { Box } from "@chakra-ui/react";
import { ReactNode } from "@tanstack/react-router";
import { PropsWithChildren } from "react";
// This is here just in case we need to add more shapes in the future

interface ShapeProps {
    type: keyof typeof SHAPES;
}
const SHAPES = {
    1: {
        viewBox: "45 33 120 120",
        width: "80vw",
        marginRight: "5vw",
        path: "M51,-60.1C62,-51.6,63.8,-31.6,64.6,-13.4C65.4,4.7,65.1,21.1,57.7,32.9C50.4,44.8,36,52.2,23.1,52C10.1,51.8,-1.5,44,-11.2,37.5C-20.8,31.1,-28.5,26,-34.2,18.5C-39.8,11.1,-43.5,1.4,-47.7,-14.2C-51.9,-29.9,-56.6,-51.4,-48.7,-60.5C-40.8,-69.5,-20.4,-66.1,-0.2,-65.8C20,-65.6,40.1,-68.6,51,-60.1Z",
        fill: "hsl(45, 90%, 45%)"
    },
    2: {
        viewBox: "25 18 155 143",
        width: "80vw",
        marginRight: "15vw",
        path: "M45.4,-44.6C61.2,-29.7,77.8,-14.8,78.6,0.8C79.4,16.4,64.4,32.9,48.6,41.3C32.9,49.8,16.4,50.3,-3.3,53.6C-23,56.8,-46,62.9,-58.3,54.5C-70.5,46,-72.1,23,-72.2,-0.1C-72.3,-23.3,-71,-46.5,-58.8,-61.5C-46.5,-76.4,-23.3,-83.1,-4.2,-78.9C14.8,-74.6,29.7,-59.6,45.4,-44.6Z",
        fill: "hsl(40, 85%, 30%)"
    },
    3: {
        viewBox: "50 45 128 130",
        width: "70vw",
        marginRight: "5vw",
        path: "M64.1,-45.7C77.5,-34.2,79.2,-7.9,73.1,15.9C67,39.6,53.2,60.8,34.2,69.4C15.1,78,-9.3,74,-25.8,62.6C-42.4,51.2,-51,32.4,-49.5,17.5C-47.9,2.6,-36.2,-8.5,-26.3,-19.2C-16.3,-29.9,-8.2,-40.2,8.6,-47C25.3,-53.9,50.6,-57.2,64.1,-45.7Z",
        fill: "hsl(38, 80%, 20%)"
    },
    4: {
        viewBox: "40 27 135 157",
        width: "70vw",
        marginRight: "25vw",
        path: "M40.9,-40.9C55.6,-26.3,71.6,-13.2,74.3,2.6C76.9,18.4,66,36.7,51.4,52.8C36.7,68.9,18.4,82.7,-0.4,83.1C-19.2,83.5,-38.4,70.6,-48.9,54.5C-59.3,38.4,-61,19.2,-58.8,2.2C-56.7,-14.9,-50.6,-29.7,-40.2,-44.2C-29.7,-58.8,-14.9,-73,-0.8,-72.2C13.2,-71.3,26.3,-55.4,40.9,-40.9Z",
        fill: "hsl(35, 71%, 12%)"
    },
    5: {
        viewBox: "18 40 130 125",
        width: "80vw",
        marginRight: "5vw",
        path: "M28,-31C37.4,-18.7,46.7,-9.3,47.3,0.6C47.9,10.5,39.7,21,30.4,32.3C21,43.6,10.5,55.7,-5.3,61C-21,66.2,-42.1,64.7,-58,53.4C-73.9,42.1,-84.7,21,-79.3,5.4C-73.9,-10.2,-52.2,-20.3,-36.3,-32.7C-20.3,-45,-10.2,-59.5,-0.4,-59.1C9.3,-58.7,18.7,-43.3,28,-31Z",
        fill: "hsl(40, 85%, 30%)"
    }
}

export const Shape: React.FC<PropsWithChildren<ShapeProps>> = ({ type, children }) => {
    return (
        <Box position={"relative"} width={SHAPES[type].width} mr={SHAPES[type].marginRight}>
            <svg viewBox={SHAPES[type].viewBox} xmlns="http://www.w3.org/2000/svg">
                <path fill={SHAPES[type].fill} d={SHAPES[type].path} transform="translate(100 100)" />
            </svg>
            <Box
                color={"white"}
                position="absolute"
                top="0"
                right="0"
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                {children}
            </Box>
        </Box>
    )
}