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
import LoadingButton from "@mui/lab/LoadingButton";
import Icon from "src/@core/components/icon";
import MenuItem from "@mui/material/MenuItem";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { deleteRfid, updateRfid } from "src/api/rfid";

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
    name: yup
      .string()
      .required("Tên là trường bắt buộc")
      .min(3, "Tên phải có ít nhất 3 kí tự")
      .max(30, "Tên tối đa chỉ chứa 30 kí tự"),
    cardId: yup
      .string()
      .required("Id của thẻ là trường bắt buộc")
      .min(6, "Id của thẻ phải có ít nhất 6 kí tự")
      .max(15, "Id của thẻ tối đa chỉ chứa 15 kí tự"),
    usercode: yup
      .string()
      .required("Mã sinh viên/nhân viên là trường bắt buộc")
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
    balance: yup
      .number()
      .typeError("Số dư phải là một số")
      .min(0, "Số dư phải lớn hơn hoặc bằng 0")
      .max(100000, "Số dư phải nhỏ hơn hoặc bằng 100000"),
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
    name: row.name || "",
    usercode: row.usercode || "",
    cardId: row.cardId || "",
    balance: row.balance || 0,
    department: row.department || "",
    carInfo: row.carInfo || "",
    carColor: row.carColor || "",
    licensePlates: row.licensePlates || "",
    role: row.role || "student",
  };

  const [tempRole, setTempRole] = useState(row.role);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(getValidationSchema(tempRole)),
  });

  useEffect(() => {
    reset({
      name: row.name || "",
      usercode: row.usercode || "",
      cardId: row.cardId || "",
      balance: row.balance || 0,
      department: row.department || "",
      carInfo: row.carInfo || "",
      carColor: row.carColor || "",
      licensePlates: row.licensePlates || "",
      role: row.role || "student",
    });
    setTempRole(row.role);
  }, [row, reset]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateRfid(id, data);
      refresh();
      toast.success(`Cập nhật thành công!`);
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
          Cập nhật thông tin thẻ RFID
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
            Cập nhật thông tin của thẻ RFID có thể ảnh hưởng đến việc ra/vào của
            người sử dụng thẻ hiện tại.
          </DialogContentText>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label="Tên chủ thẻ"
                      onChange={onChange}
                      error={Boolean(errors.name)}
                      {...(errors.name && {
                        helperText: errors.name.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="usercode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label="Mã sinh viên/nhân viên"
                      onChange={onChange}
                      error={Boolean(errors.usercode)}
                      {...(errors.usercode && {
                        helperText: errors.usercode.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="cardId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label="Id của thẻ"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.cardId)}
                      {...(errors.cardId && {
                        helperText: errors.cardId.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="balance"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label="Số dư"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.balance)}
                      {...(errors.balance && {
                        helperText: errors.balance.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label="Khoa/Phòng"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.department)}
                      {...(errors.department && {
                        helperText: errors.department.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="carInfo"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label="Phương tiện"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.carInfo)}
                      {...(errors.carInfo && {
                        helperText: errors.carInfo.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="carColor"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label="Màu"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.carColor)}
                      {...(errors.carColor && {
                        helperText: errors.carColor.message,
                      })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="licensePlates"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      label="Biển số xe"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.licensePlates)}
                      {...(errors.licensePlates && {
                        helperText: errors.licensePlates.message,
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
                      label="Loại thẻ"
                      value={value}
                      sx={{ mb: 4 }}
                      onBlur={onBlur}
                      onChange={(event) => {
                        setTempRole(event.target.value);
                        onChange(event);
                      }}
                      error={Boolean(errors.role)}
                      {...(errors.role && {
                        helperText: errors.role.message,
                      })}
                    >
                      <MenuItem value="student">Sinh viên</MenuItem>
                      <MenuItem value="teacher">Giảng viên</MenuItem>
                      <MenuItem value="employee">Nhân viên</MenuItem>
                      <MenuItem value="guest">Khách</MenuItem>
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
            Xác nhận xóa thẻ RFID
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {`Bạn có xác nhận muốn xóa thẻ ${row.cardId}, thao tác này sẽ xóa toàn bộ dữ liệu của thẻ này khỏi hệ thống?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await deleteRfid(id);
                refresh();
                toast.success(`Xóa thẻ ${row.cardId} thành công!`);
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
