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
import { createRfid } from "src/api/rfid";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Tên phải có ít nhất 3 kí tự")
    .max(30, "Tên tối đa chỉ chứa 30 kí tự"),
  cardId: yup
    .string()
    .required("Id của thẻ là trường bắt buộc")
    .min(6, "Id của thẻ phải có ít nhất 6 kí tự")
    .max(15, "Id của thẻ tối đa chỉ chứa 15 kí tự"),
  usercode: yup
    .string()
    .min(6, "Mã sinh viên/nhân viên  phải có ít nhất 6 kí tự")
    .max(15, "Mã sinh viên/nhân viên tối đa chỉ chứa 15 kí tự"),
  department: yup
    .string()
    .min(3, "Khoa/Phòng phải có ít nhất 3 kí tự")
    .max(30, "Khoa/Phòng tối đa chỉ chứa 30 kí tự"),
  carInfo: yup
    .string()
    .min(3, "Thông tin xe  phải có ít nhất 3 kí tự")
    .max(30, "Thông tin xe tối đa chỉ chứa 30 kí tự"),
  carColor: yup
    .string()
    .min(2, "Màu xe phải có ít nhất 2 kí tự")
    .max(15, "Màu xe tối đa chỉ chứa 15 kí tự"),
  licensePlates: yup
    .string()
    .min(6, "Biển số xe phải có ít nhất 6 kí tự")
    .max(15, "Biển số xe tối đa chỉ chứa 15 kí tự"),
});

//schema riêng cho trường hợp role = "guest"
const guestSchema = yup.object().shape({
  cardId: schema.fields.cardId,
});

const getValidationSchema = (role) => {
  if (role === "guest") {
    return guestSchema;
  } else {
    return schema;
  }
};

const defaultValues = {
  cardId: "",
  name: "",
  usercode: "",
  department: "",
  carInfo: "",
  carColor: "",
  licensePlates: "",
};

const SidebarAddUser = (props) => {
  // ** Props
  const { open, toggle, fetchData } = props;

  // ** State
  const [role, setRole] = useState("student");
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
    resolver: yupResolver(getValidationSchema(role)),
  });

  const onSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const combinedData = {
          ...data,
          role: role,
        };
        await createRfid(combinedData).then(() => {
          toggle();
          reset();
          setRole("student");
          setTimeout(function () {
            setLoading(false);
          }, 500);
          if (fetchData) {
            fetchData();
            toast.success("Thêm thẻ RFID mới thành công!");
          }
        });
      } catch (error) {
        setLoading(false);
      }
    },
    [role, toggle, reset, fetchData]
  );

  const handleClose = () => {
    setRole("student");
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
        <Typography variant="h5">Thêm thẻ RFID</Typography>
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
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Tên chủ thẻ"
                onChange={onChange}
                error={Boolean(errors.name)}
                {...(errors.name && {
                  helperText: errors.name.message,
                })}
              />
            )}
          />
          <Controller
            name="usercode"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label="Mã sinh viên/nhân viên"
                onChange={onChange}
                error={Boolean(errors.usercode)}
                {...(errors.usercode && {
                  helperText: errors.usercode.message,
                })}
              />
            )}
          />
          <Controller
            name="cardId"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Id của thẻ"
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.cardId)}
                {...(errors.cardId && { helperText: errors.cardId.message })}
              />
            )}
          />
          <Controller
            name="department"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Khoa/Phòng"
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.department)}
                {...(errors.department && {
                  helperText: errors.department.message,
                })}
              />
            )}
          />
          <Controller
            name="carInfo"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Phương tiện"
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.carInfo)}
                {...(errors.carInfo && {
                  helperText: errors.carInfo.message,
                })}
              />
            )}
          />
          <Controller
            name="carColor"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Màu"
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.carColor)}
                {...(errors.carColor && {
                  helperText: errors.carColor.message,
                })}
              />
            )}
          />
          <Controller
            name="licensePlates"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label="Biển số xe"
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.licensePlates)}
                {...(errors.licensePlates && {
                  helperText: errors.licensePlates.message,
                })}
              />
            )}
          />
          <CustomTextField
            select
            fullWidth
            value={role}
            sx={{ mb: 4 }}
            label="Loại thẻ"
            onChange={(e) => setRole(e.target.value)}
            SelectProps={{
              value: role,
              onChange: (e) => setRole(e.target.value),
            }}
          >
            <MenuItem value="student">Sinh viên</MenuItem>
            <MenuItem value="teacher">Giảng viên</MenuItem>
            <MenuItem value="employee">Nhân viên</MenuItem>
            <MenuItem value="guest">Khách</MenuItem>
          </CustomTextField>
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
