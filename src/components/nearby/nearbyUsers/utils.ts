import store from "~/redux/store";

import { modalizeRef } from "~/components/common";
import { NearByUsersByModal } from "~/containers/nearbyUsers/NearByUsersByModal";
import { showBottomSheet } from "~/redux/reducers/bottomSheet.reducer";
import { verticalScale } from "~/utils/";

export const showNearByModal = () => {
  store.dispatch(
    showBottomSheet({
      Content: NearByUsersByModal,
      props: {
        closeOnOverlayTap: true,
        modalHeight: verticalScale(250)
      }
    })
  );
};
