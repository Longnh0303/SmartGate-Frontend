// ** React Imports
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

// ** MUI Imports
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

// ** Custom Component Import
import CustomTextField from "src/@core/components/mui/text-field";

// ** Third Party Imports
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Actions Imports
import { createDevice } from "src/api/device";
const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));

const schema = yup.object().shape({
  mac: yup
    .string()
    .required("Địa chỉ MAC của thiết bị là trường bắt buộc")
    .min(12, "Địa chỉ MAC phải có ít nhất 12 kí tự")
    .max(30, "Địa chỉ MAC chỉ chứa 30 kí tự"),
  describe: yup
    .string()
    .min(6, "Mô tả có ít nhất 3 kí tự")
    .max(15, "Mô tả tối đa chỉ chứa 50 kí tự"),
});

const defaultValues = {
  mac: "",
  describe: "",
};

const SidebarAddUser = (props) => {
  // ** Props
  const { open, toggle, fetchData } = props;

  // ** State
  const [loading, setLoading] = useState(false);

  // ** Hooks

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        await createDevice(data).then(() => {
          toggle();
          reset();
          setTimeout(function () {
            setLoading(false);
          }, 500);
          if (fetchData) {
            fetchData();
            toast.success("Thêm thiết bị mới thành công!");
          }
        });
      } catch (error) {
        setLoading(false);
      }
    },
    [toggle, reset, fetchData]
  );

  const handleClose = () => {
    toggle();
    reset();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: "100vw", sm: 400 } } }}
    >
      <Header>
        <Typography variant="h5">Thêm thiết bị</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            p: "0.438rem",
            borderRadius: 1,
            color: "text.primary",
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: (theme) =>
                `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="mac"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Địa chỉ MAC"
                onChange={onChange}
                error={Boolean(errors.mac)}
                {...(errors.mac && {
                  helperText: errors.mac.message,
                })}
              />
            )}
          />
          <Controller
            name="describe"
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Mô tả"
                onChange={onChange}
                error={Boolean(errors.describe)}
                {...(errors.describe && {
                  helperText: errors.describe.message,
                })}
              />
            )}
          />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LoadingButton
              loading={loading}
              variant="contained"
              sx={{ mr: 3 }}
              type="submit"
            >
              Xác nhận
            </LoadingButton>
            <Button
              variant="tonal"
              color="secondary"
              onClick={() => {
                handleClose();
                toast.success("Đã huỷ thao tác!");
              }}
            >
              Thoát
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarAddUser;
