# This value must be changed to match the number of public inputs (including return values!) in your program.
NUM_PUBLIC_INPUTS=0
PUBLIC_INPUT_BYTES=32*NUM_PUBLIC_INPUTS
HEX_PUBLIC_INPUTS=$(head -c $PUBLIC_INPUT_BYTES ./target/proof | od -An -v -t x1 | tr -d $' \n')
HEX_PROOF=$(tail -c +$(($PUBLIC_INPUT_BYTES + 1)) ./target/proof | od -An -v -t x1 | tr -d $' \n')

echo "Public inputs:"
echo $HEX_PUBLIC_INPUTS

echo "Proof:"
echo "0x$HEX_PROOF"