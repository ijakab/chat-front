import Swal from 'sweetalert2'

let mixin =  Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

export default mixin
