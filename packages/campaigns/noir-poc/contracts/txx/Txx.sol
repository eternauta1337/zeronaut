// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {UltraVerifier} from "./Verifier.sol";
import {ILevel} from "zeronaut-contracts/contracts/interfaces/ILevel.sol";
import {Zeronaut} from "zeronaut-contracts/contracts/Zeronaut.sol";

contract Txx is ILevel, UltraVerifier {
    string _instructions;

    constructor(string memory __instructions) {
        _instructions = __instructions;
    }

    function instructions() public view returns (string memory) {
        return _instructions;
    }

    function check(bytes calldata proof, bytes32[] calldata publicInputs) public view returns (bool) {
        return this.verify(proof, publicInputs);
    }

    function circuit() public pure returns (string memory) {
        return "{\"abi\":{\"parameters\":[{\"name\":\"signature\",\"type\":{\"kind\":\"array\",\"length\":64,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"pubKeyX\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"pubKeyY\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"public\"},{\"name\":\"hashedMsg\",\"type\":{\"kind\":\"array\",\"length\":32,\"type\":{\"kind\":\"integer\",\"sign\":\"unsigned\",\"width\":8}},\"visibility\":\"private\"},{\"name\":\"password\",\"type\":{\"kind\":\"string\",\"length\":8},\"visibility\":\"private\"}],\"return_type\":null,\"error_types\":{}},\"bytecode\":\"H4sIAAAAAAAA/9WZZ3MbVRSG15gSekLvOIQSuqolURNCcei9F8uWHBuCE+wUehxq6L03UxPHvfdegT/Ffa19iXg/3Rnu/ZCdOXP1TM5kzsirc87uUxIUriUTf4efS0yUhp9XFHGJ8CHCpcKHCh8mfLjwEcIrhI8UPkr4aOFjhI8VPk74eOGVwquETxA+Ufgk4ZOFTxE+Vfg04dOFzxA+U/gs4bOFzxE+V7hMeLXwecJrhM8XvkD4QuGLhNcKXyx8ifClwpcJXy58hfCVwhHhqHBMOC6cEE4KlwunhNPCGeGrhK8Wvkb4WuHrhK8XXie8XvgG4Q3CNwrfJHyz8C3CFcIbhW8Vvk34duE7hO8Uvkv4buF7hO8Vvk/4fuEHhB8Ufkj4YeFHhB8Vfkz4ceEnhJ8Ufkq4UjgrXCVcLZwTzgvXCG8SrhWuE35a+BnhzcLPCtcLbxHeKvyccINwo/A24e3CO4R3Cj8v/ILwi8IvCb8s/Irwq8K7hJuEdwu/Jvy68BvCbwq/Jfy28B7hd4TfFX5P+H3hD4Q/FP5I+GPhT4Q/Ff5M+HPhL4S/FP5K+Gvhb4S/Ff5O+HvhH4R/FP5JuFn4Z+FfhH8V/k34d+E/hPcWMXa7dSGvD0/Omw3hyfnCucJ5wjlSEZ6cG5wXnBOcD5wLnAecA+z/7Pvs9+zz7O/s6+zn7OPs3+zb7Nfs0+zP7Mvsx+zDleGZDU/22+rwZH9lX2U/ZR+tDU/2TfZL9kn2R/ZF9kP2QfY/9j32O/Y59jf2NfYz9jH2L/Yt9iv2KfYn9iX2I/ahIDhwP+Dk80ZpePL5gs8VfJ7gcwSDzw18XuBzAp8P+FzA5wE+B3D/597PfZ97Pvd77vXc57nHc3/n3s59nXs693Pu5dzHuYeXhefq8OS+vSY8uV9zr+Y+zT16bXhyb+a+zD2Z+zH3Yu7D3IO5/3Lv5b7LPZf7Lfda7rPcY7m/cm/lvso9lfsp91Luo9xDm8Jzd3hy3nDOcL5wrnCecI7sCU/ODc4LzgnOB84FzgPOAfZ/9n32e/Z59nf2dfZz9nH2b/Zt9mv2afZn9mX2Y/bhfcF/r5LwXBeekf93RfcV/V/xSHkikU/F8tF4NBuJZarSyUgiWVWejqajyXQyF0vH4/l0Ip3KVGVSkUw0Ec9Ha5KZeE34n6E2/h5xNYefOTM4KzgjOBs4EzgLOANaTOw30WqizUS7iQ4TnSa6THSb6DHRa6LPRL+JARODJoZMDJsYMTFqYszEuIkJE5MmpkxMm5gxMWtizsS8iQUTi0HhXYjP773Fwfeer8EVz/qsc7+zOjNe62x1Vmcu7bPONmd1puM+62x3VmfK6/fZ4azOWNJnnZ3O6izP+Kyzy1mdea/3Z7ezOuN5n3X2uKsz57PO3uDg+L33uauz2med/c7qzMd81jngrM6s19/RoLM6kwmfdQ65uz+9zqNhZ3VmvNY54qzOKq9/91F396fX3/uYszpzXuscd1ZnwmtfmnBWZ8rr9znprM6Y1z1kylmdyYjPOqfd3Z9e+9KMszprUj7rnHVWZ5XX56M5Z3XmvD4fzTurMxn1WeeCuzrLfda56KzOrNf7c8nd9/nv+1xctVIzPExp+O9wL/AudC5wLfAscCzwK3Ar8CpwKvApcCnwKHAo8CdwJ/AmcCbwJXAl8CRwJPAjcCPwInAiZUHBhcCDwIHAf8B9wHvAeawNCq4DngOOA34DbgNeA04DQwE3NIYtfoBovlhgcfOgweHhFX8geAo4CvgJuAl4CTiJpqDgIuAh4CDgH+Ae4B3gHOAb4BrgGeAY4BfgFuAV4BTgE+AS4BHgEOAP4A7gDeAM4AvgCuAJ4AjgB+AG4AXgBJqDwvt0vEvHe3S8Q8f7c7w731v0t8e5Pij4UrhSeFI4UvhRuNGKoOBE4UPhQuFB4UDhP+E+4T3hPOE74TrhOeE44TfhNuE14TThM+Ey4THhMOEv4S4rg4KzhK/EgzaWBixi8JNwk7if4CThI+Ei4SHhIOEf4R7hHeEc4RvhGuEZ4RjhF+EW4RXhFOET4RLhEeEQ4Q93BQeu1UWfW4o+rwrPjfU7spvrcmWNdZvqs9u2Nywvi61FiSslcWu2sXHnloblJajNMq/dMq/DMq/TMq/LMq/bMq/HMq/XMq/PMq/fMm/AMm/QMm/IMm/YMm/EMm/UMm/MMm/cMm/CMm/SMm/KMm/aMm/GMm/WMm/OMm/eMm/BMm/RMm/JMu9Py7y/LPOWr38AophGmBYuAAA=\"}";
    }
}


