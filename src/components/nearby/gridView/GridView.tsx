import React, { FC, memo } from "react";
import { View, ListRenderItem } from "react-native";

import Config from "react-native-config";
import { useTheme } from "react-native-paper";

import { GridViewProps } from "./gridView.types";

import { CText, CustomFlatList } from "~/components/";
import { UserProfileImage } from "~/components/profile";
import nearbyUsersStyles from "~/containers/nearbyUsers/nearbyUsers.styles";
import { SimpleUser } from "~/types/user";
import { scale } from "~/utils/responsivityUtil";

const GridView: FC<GridViewProps> = props => {
  const { onUserImagePress, users } = props;

  const { colors } = useTheme();
  const {
    gridViewContainer,
    userCardImage,
    nearUserCardRoot,
    userNearCardContainer,
    columnWrapperStyle,
    alignSelfCenter
  } = nearbyUsersStyles(colors);

  const renderItem: ListRenderItem<SimpleUser> = ({ item }) => (
    <View style={nearUserCardRoot}>
      <View style={[userCardImage, alignSelfCenter]}>
        <UserProfileImage
          source={{
            uri: `${Config.AVATAR_MEDIA_PREFIX}/${item?.profileImage}_s.jpg`
          }}
          width={scale(60)}
          height={scale(60)}
          borderRadius={10}
          onPress={onUserImagePress(item)}
        />
      </View>
      <View style={userNearCardContainer}>
        <CText fontSize={14} numberOfLines={1}>
          {item?.name}
        </CText>
        <CText fontSize={14} numberOfLines={1}>
          {item?.country?.name}
        </CText>
      </View>
    </View>
  );

  return (
    <CustomFlatList
      keyExtractor={item => item.uuid}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={gridViewContainer}
      columnWrapperStyle={columnWrapperStyle}
      data={users}
      renderItem={renderItem}
    />
  );
};

export default memo(GridView);
