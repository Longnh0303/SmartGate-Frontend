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
import { deleteDevice, updateDevice } from "src/api/device";
const DeviceDialog = (props) => {
  const {
    openUpdate = false,
    toggleUpdate = () => {},
    row = [],
    refresh = () => {},
    openDelete = false,
    toggleDelete = () => {},
  } = props;

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
    mac: row.mac || "",
    describe: row.describe || "",
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
      mac: row.mac || "",
      describe: row.describe || "",
    });
  }, [row, reset]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await updateDevice(id, data);
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
          Cập nhật thông tin thiết bị
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
            Cập nhật thông tin của thiết bị có thể ảnh hưởng đến khả năng hoạt
            động của thiết bị tức thời.
          </DialogContentText>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
            Xác nhận xóa thiết bị
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {`Bạn có xác nhận muốn xóa thiết bị ${row.mac}, thao tác này sẽ xóa toàn bộ dữ liệu của thiết bị này khỏi hệ thống?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await deleteDevice(id);
                refresh();
                toast.success(`Xóa thiết bị ${row.mac} thành công!`);
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

export default DeviceDialog;
