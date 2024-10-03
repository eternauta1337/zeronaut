// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./Verifier.sol";
import "./interfaces/ILevel.sol";

contract DummyLevel is ILevel {
    UltraVerifier verifier;

    constructor(address _verifier) payable {
        verifier = UltraVerifier(_verifier);
    }

    function instructions() external pure returns (string memory) {
        return "Dummy level instructions";
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) external view returns (bool) {
        return verifier.verify(proof, publicInputs);
    }

    function circuit() external pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"secret\",\"type\":{\"kind\":\"field\"},\"visibility\":\"private\"},{\"name\":\"signature\",\"type\":{\"kind\":\"array\",\"length\":64,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyX\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"pubKeyY\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"hashedMsg\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"H4sIAAAAAAAA/7WWZW+bdxxFnyzd1jEzpesgYzu2Y3vUdB1kzExJGmcZM1PGXZkZEvWLtkf+XzU9L/qmrSXr16NKluU899w7UPVfC0ffh8u/B46+B8tduojPEA+Kl4jPFJ8lPlu8VHyO+FzxeeLzxReILxRfJL5YfIn4UvFl4svFV4ivFF8lvlp8jfha8XXi68U3iG8U3yQeEi8T3yxeLr5FfKv4NvHt4mHxHeI7xXeJ7xbfI75XfJ+4Jq6LR8QNcVPcEo+K2+KOuCu+X/yA+EHxQ+KHxSvEY+KV4kfEq8SPih8TPy5+QjwuflL8lPhp8TPiZ8XPiZ8XvyB+UfyS+GXxK+JXxa+JXxe/IX5T/Jb4bfE74nfF74nfF0+IJ8VT4tXiaXFPPCP+QDwr/lD8kfhj8SfiT8WfiT8XfyH+UvyV+GvxN+Jvxd+Jvxf/IP5R/JP4Z/Ev4l/Fv4l/F8+J/xD/Kf5L/Lf4H/G/4v/Ea8T/i9eK14nXizeIN4o3iTeLt4i3ireJt4t3iHeKd4l3i/eI94r3ifeLD4gPig+J5xcxW2tl4Xh/VbnxfPwer8fn4+XG3/F2fB1Px8/xcnwcD8e/8W58G8/Gr/FqfBqPxp/xZnwZT8aP8WJ8OFHuZLnx3upy47n4LV6Lz2bLjb/irfgqnoqf4qX4KB6Kf+Kd+CaeiV/ilfgkHok/4o34Ip6IH+KF+GCuOvYccLP7B8vNzs++z67Pns87+z27PXs9Oz37PLs8ezw7PPs7uzt7Ozs7+zq7Ons6Ozr7Obs5ezk7Ofs4uzh7eKjcZeVm9y4vNzs3+za7Nnt2uNzs1+zW7NXs1OzT7NLs0ezQ7M/szuzN7Mzsy+zK7MnsyOzH7MbsxezE7MPswuzBsXLj/3g/vo/n4/d4PT5fU278HW/H1/F0/Bwvx8fxcPwb78a38Wz8Gq/Gp/Fo/BlvxpfxZPwYL8aH8+UuVMe/BsodK7d2cq/6wqLPatRGm81ee6RXb9QnayPdqU6r1mxNjXbqnXqr05oe6TQavU6z0+5Oddu1br3Z6NVnWt3GTPmw0/k9q1PwPXszvKbbfLcl5bMm9Z3xzGD5f9yCV+IUXIJHcAj+wB14A2fgC1yBJ3AEfsANeAEn4ANcgAdwAPkn++SezA9V/ayTczJOvsk2uSbTw1U/y+SYDJNfsktuySw/Pj8SOSWj5JNskksySR7JIjkkg+SP7JG7FeW3JWvkjIyRL7JFrsgUeSJL5IgMkR+yQ27IDHkhK+SEjJAPskEuyAR5IAvkgAzw/PPs89zzzM9Xx/6+dD59T9fT83Q8/U63j1f9TqfP6XJ6nA6nv+luepvOpq/panqajqaf6WZ6mU6mj+liepgOpn/p3omq/0zQt3QtPUvH0q9062zV71T6lC6lR+lQ+pPupDfpTPqSrqQn6Uj6kW6kF+lE+pAupAfpQPqP7purTvA6AoRwqQkpEwAA\"}";
    }
}