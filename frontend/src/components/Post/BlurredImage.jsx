import React from "react";
import { Box, Skeleton } from "@mui/material";
import clsx from "clsx";
import styles from "./Post.module.scss";

export const BlurredImage = ({ imageUrl, title, isFullPost }) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <Box
      position="relative"
      width="100%"
      height={isFullPost ? "50vh" : "40vh"}
      sx={{ overflow: "hidden" }}
    >
      {/* Фон с размытием, использующий то же изображение */}
      <Box
        component="img"
        src={imageUrl}
        alt={`${title} background`}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(20px)",
          transform: "scale(1.1)",
          zIndex: 0,
        }}
      />

      {/* Скелетон на время загрузки */}
      {!imgLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        />
      )}

      {/* Основное изображение */}
      <Box
        component="img"
        src={imageUrl}
        alt={title}
        onLoad={() => setImgLoaded(true)}
        className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
        sx={{
          display: imgLoaded ? "block" : "none",
          position: "relative",
          zIndex: 2,
        }}
      />
    </Box>
  );
};
