import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CustomTextField from "src/@core/components/mui/text-field";
import toast from "react-hot-toast";
import { updateUser, deleteUser } from "src/api/user";
import LoadingButton from "@mui/lab/LoadingButton";
import Icon from "src/@core/components/icon";
import { VALID_PHONE_REGEX } from "src/constants/regex";
import MenuItem from "@mui/material/MenuItem";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const UserDialog = (props) => {
  const {
    openUpdate = false,
    toggleUpdate = () => {},
    row = [],
    refresh = () => {},
    openDelete = false,
    toggleDelete = () => {},
  } = props;

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là trường bắt buộc"),
    phone: yup
      .string()
      .matches(VALID_PHONE_REGEX, "Số điện thoại chỉ được chứa số")
      .min(10, "Số điện thoại phải có ít nhất 10 số ")
      .max(15, "Số điện thoại tối đa 15 số"),
    username: yup
      .string()
      .required("Tên là trường bắt buộc")
      .min(3, "Tên phải có ít nhất 3 kí tự")
      .max(30, "Tên tối đa chỉ chứa 30 kí tự"),
  });

  const defaultValues = {
    username: row.username || "",
    email: row.email || "",
    phone: row.phone || "",
    role: row.role || "operator",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset({
      username: row.username || "",
      email: row.email || "",
      phone: row.phone || "",
      role: row.role || "operator",
    });
  }, [row, reset]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateUser(id, data);
      refresh();
      toast.success(`Cập nhật ${row.username} thành công!`);
    } catch (error) {
    } finally {
      setTimeout(function () {
        setLoading(false);
      }, 500);
      toggleUpdate(false);
    }
  };

  const id = row.id;

  return (
    <>
      {/* Edit Dialog */}
      <Dialog
        open={openUpdate}
        onClose={() => toggleUpdate(false)}
        aria-labelledby="user-view-edit"
        aria-describedby="user-view-edit-description"
        sx={{ "& .MuiPaper-root": { width: "100%", maxWidth: 650 } }}
      >
        <DialogTitle
          id="user-view-edit"
          sx={{
            textAlign: "center",
            fontSize: "1.5rem !important",
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
            pt: (theme) => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`,
            ],
          }}
        >
          Cập nhật thông tin người dùng
        </DialogTitle>
        <DialogContent
          sx={{
            pb: (theme) => `${theme.spacing(8)} !important`,
            px: (theme) => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`,
            ],
          }}
        >
          <DialogContentText
            variant="body2"
            id="user-view-edit-description"
            sx={{ textAlign: "center", mb: 7 }}
          >
            Cập nhật thông tin của người dùng có thể ảnh hưởng đến các vấn đề về
            bảo mật.
          </DialogContentText>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label="Tên"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                      {...(errors.username && {
                        helperText: errors.username.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label="Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      {...(errors.email && {
                        helperText: errors.email.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label="Số điện thoại"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                      {...(errors.phone && {
                        helperText: errors.phone.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label="Vai trò"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.role)}
                      {...(errors.role && {
                        helperText: errors.role.message,
                      })}
                    >
                      <MenuItem value="manager">Quản lý</MenuItem>
                      <MenuItem value="operator">Vận hành</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                pt: (theme) => `${theme.spacing(6.5)} !important`,
                display: "flex",
                justifyContent: "right",
              }}
            >
              <LoadingButton
                loading={loading}
                variant="contained"
                sx={{ mr: 3 }}
                type="submit"
              >
                Cập nhật
              </LoadingButton>
              <Button
                variant="tonal"
                color="secondary"
                onClick={() => {
                  toggleUpdate(false);
                  reset(defaultValues);
                  toast.success("Đã hủy thao tác!");
                }}
              >
                Hủy
              </Button>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => {
          toggleDelete(false);
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Icon
              icon={"tabler:alert-circle-filled"}
              fontSize={24}
              style={{ marginRight: 6 }}
            />
            Xác nhận xóa người dùng
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {`Bạn có xác nhận muốn xóa người dùng ${row.username}, thao tác này sẽ xóa toàn bộ dữ liệu của người dùng này khỏi hệ thống?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await deleteUser(id);
                refresh();
                toast.success(`Xóa người dùng ${row.username} thành công!`);
              } catch (error) {
              } finally {
                toggleDelete(false);
              }
            }}
          >
            Đồng ý
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              toggleDelete(false);
              toast.success("Đã hủy thao tác!");
            }}
          >
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDialog;
